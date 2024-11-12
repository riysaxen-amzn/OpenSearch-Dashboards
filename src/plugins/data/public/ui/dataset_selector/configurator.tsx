/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFieldText,
  EuiForm,
  EuiFormLabel,
  EuiFormRow,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiText,
} from '@elastic/eui';
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';
import React, { useEffect, useMemo, useState } from 'react';
import { BaseDataset, DEFAULT_DATA, Dataset, DatasetField, Query } from '../../../common';
import { getIndexPatterns, getQueryService } from '../../services';
import { IDataPluginServices } from '../../types';
import { DatasetIndexedView } from '../../query/query_string/dataset_service';
import { cloneDeep } from 'lodash';

export const Configurator = ({
  services,
  baseDataset,
  onConfirm,
  onCancel,
  onPrevious,
}: {
  services: IDataPluginServices;
  baseDataset: BaseDataset;
  onConfirm: (query: Partial<Query>) => void;
  onCancel: () => void;
  onPrevious: () => void;
}) => {
  const queryService = getQueryService();
  const queryString = queryService.queryString;
  const languageService = queryService.queryString.getLanguageService();
  const indexPatternsService = getIndexPatterns();
  const type = queryString.getDatasetService().getType(baseDataset.type);
  const languages = type?.supportedLanguages(baseDataset) || [];
  const [selectIndexedView, setSelectIndexedView] = useState(false);

  const [language, setLanguage] = useState<string>(() => {
    const currentLanguage = queryString.getQuery().language;
    if (languages.includes(currentLanguage)) {
      return currentLanguage;
    }
    return languages[0];
  });

  const [dataset, setDataset] = useState<Dataset>({
    ...(cloneDeep(baseDataset)),
    language,
  });
  const [timeFields, setTimeFields] = useState<DatasetField[]>([]);
  const [timeFieldName, setTimeFieldName] = useState<string | undefined>(dataset.timeFieldName);
  const noTimeFilter = i18n.translate(
    'data.explorer.datasetSelector.advancedSelector.configurator.timeField.noTimeFieldOptionLabel',
    {
      defaultMessage: "I don't want to use the time filter",
    }
  );
  const indexedViewsService = type?.indexedViewsService;
  const [selectedIndexedView, setSelectedIndexedView] = useState<string>();
  const [indexedViews, setIndexedViews] = useState<DatasetIndexedView[]>([]);
  const [isLoadingIndexedViews, setIsLoadingIndexedViews] = useState(false);

  useEffect(() => {
    const getIndexedViews = async () => {
      if (indexedViewsService) {
        setIsLoadingIndexedViews(true);
        const fetchedIndexedViews = await indexedViewsService.getIndexedViews(baseDataset);
        setIsLoadingIndexedViews(false);
        setIndexedViews(fetchedIndexedViews || []);
      }
    };

    getIndexedViews();
  }, [indexedViewsService, baseDataset]);

  const submitDisabled = useMemo(() => {
    return (
      isLoadingIndexedViews ||
      (timeFieldName === undefined &&
        !(
          languageService?.getLanguage(language)?.hideDatePicker ||
          dataset.type === DEFAULT_DATA.SET_TYPES.INDEX_PATTERN
        ) &&
        timeFields &&
        timeFields.length > 0)
    );
  }, [
    dataset,
    language,
    timeFieldName,
    timeFields,
    languageService,
    isLoadingIndexedViews,
  ]);

  useEffect(() => {
    const fetchFields = async () => {
      const datasetFields = await queryString
        .getDatasetService()
        .getType(baseDataset.type)
        ?.fetchFields(baseDataset);

      const dateFields = datasetFields?.filter((field) => field.type === 'date');
      setTimeFields(dateFields || []);
    };

    if (baseDataset?.dataSource?.meta?.supportsTimeFilter === false && timeFields.length > 0) {
      setTimeFields([]);
      return;
    }

    fetchFields();
  }, [baseDataset, indexPatternsService, queryString, timeFields.length]);

  return (
    <>
      <EuiModalHeader>
        <EuiModalHeaderTitle>
          <h1>
            <FormattedMessage
              id="data.explorer.datasetSelector.advancedSelector.configurator.title"
              defaultMessage="Step 2: Configure data"
            />
          </h1>
          <EuiText>
            <p>
              <FormattedMessage
                id="data.explorer.datasetSelector.advancedSelector.configurator.description"
                defaultMessage="Configure selected data based on parameters available."
              />
            </p>
          </EuiText>
        </EuiModalHeaderTitle>
      </EuiModalHeader>
      <EuiModalBody>
        <EuiForm className="datasetConfigurator">
          <EuiFormRow
            label={i18n.translate(
              'data.explorer.datasetSelector.advancedSelector.configurator.datasetLabel',
              {
                defaultMessage: 'Data',
              }
            )}
          >
            <EuiFieldText disabled value={dataset.title} />
          </EuiFormRow>
          {indexedViewsService && (
            <>
              <EuiSpacer />
              <EuiSwitch
                compressed
                checked={selectIndexedView}
                label={
                  <EuiFormLabel>
                    {i18n.translate(
                      'data.explorer.datasetSelector.advancedSelector.configurator.showAvailableIndexedViewsLabel',
                      {
                        defaultMessage: 'Query indexed view'
                      }
                    )}
                  </EuiFormLabel>  }
                onChange={(e) => setSelectIndexedView(e.target.checked)}
              />
              <EuiSpacer size='m' />
              {selectIndexedView && (
                <EuiFormRow
                  label={i18n.translate(
                    'data.explorer.datasetSelector.advancedSelector.configurator.indexedViewLabel',
                    {
                      defaultMessage: 'Available indexed views',
                    }
                  )}
                  helpText={i18n.translate(
                    'data.explorer.datasetSelector.advancedSelector.configurator.indexedViewHelpText',
                    {
                      defaultMessage: 'Select an indexed view to speed up your query.',
                    }
                  )}
                >
                  <EuiSelect
                    isLoading={isLoadingIndexedViews}
                    options={indexedViews.map(({ name }) => ({
                      text: name,
                      value: name,
                    }))}
                    value={selectedIndexedView}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setSelectedIndexedView(value);
                      let connectedDataSource;
                      if (dataset.dataSource?.id) {
                        const connectedDataSourceSavedObj: any = await indexedViewsService.getConnectedDataSource(dataset.dataSource.id);
                        if (connectedDataSourceSavedObj) {
                          connectedDataSource = {
                            id: connectedDataSourceSavedObj.id,
                            title: connectedDataSourceSavedObj.attributes?.title,
                            type: 'DATA_SOURCE'
                          }
                        }         
                      }
                      setDataset({
                        ...dataset,
                        id: `${dataset.id}.${value}`,
                        title: value,
                        type: DEFAULT_DATA.SET_TYPES.INDEX,
                        ref: {
                          id: dataset.id,
                          type: dataset.type,
                        },
                        dataSource: connectedDataSource ?? dataset.dataSource
                      });
                    }}
                    hasNoInitialSelection
                  />
                </EuiFormRow>
              )}
              
            </>
          )}
          <EuiFormRow
            label={i18n.translate(
              'data.explorer.datasetSelector.advancedSelector.configurator.languageLabel',
              {
                defaultMessage: 'Language',
              }
            )}
          >
            <EuiSelect
              options={languages.map((languageId) => ({
                text: languageService.getLanguage(languageId)?.title || languageId,
                value: languageId,
              }))}
              value={language}
              onChange={(e) => {
                setLanguage(e.target.value);
                setDataset({ ...dataset, language: e.target.value });
              }}
              data-test-subj="advancedSelectorLanguageSelect"
            />
          </EuiFormRow>
          {!languageService?.getLanguage(language)?.hideDatePicker &&
            (dataset.type === DEFAULT_DATA.SET_TYPES.INDEX_PATTERN ? (
              <EuiFormRow
                label={i18n.translate(
                  'data.explorer.datasetSelector.advancedSelector.configurator.indexPatternTimeFieldLabel',
                  {
                    defaultMessage: 'Time field',
                  }
                )}
              >
                <EuiFieldText disabled value={dataset.timeFieldName ?? 'No time field'} />
              </EuiFormRow>
            ) : (
              <EuiFormRow
                label={i18n.translate(
                  'data.explorer.datasetSelector.advancedSelector.configurator.timeFieldLabel',
                  {
                    defaultMessage: 'Time field',
                  }
                )}
              >
                <EuiSelect
                  options={[
                    ...timeFields.map((field) => ({
                      text: field.displayName || field.name,
                      value: field.name,
                    })),
                    { text: '-----', value: '-----', disabled: true },
                    { text: noTimeFilter, value: noTimeFilter },
                  ]}
                  value={timeFieldName}
                  onChange={(e) => {
                    const value = e.target.value === noTimeFilter ? undefined : e.target.value;
                    setTimeFieldName(e.target.value);
                    setDataset({ ...dataset, timeFieldName: value });
                  }}
                  hasNoInitialSelection
                  data-test-subj="advancedSelectorTimeFieldSelect"
                />
              </EuiFormRow>
            ))}
        </EuiForm>
      </EuiModalBody>
      <EuiModalFooter>
        <EuiButtonEmpty onClick={onCancel}>
          <FormattedMessage
            id="data.explorer.datasetSelector.advancedSelector.cancel"
            defaultMessage="Cancel"
          />
        </EuiButtonEmpty>
        <EuiButton onClick={onPrevious} iconType="arrowLeft" iconSide="left">
          <FormattedMessage
            id="data.explorer.datasetSelector.advancedSelector.previous"
            defaultMessage="Back"
          />
        </EuiButton>
        <EuiButton
          onClick={async () => {
            await queryString?.getDatasetService().cacheDataset(dataset, services);
            onConfirm({ dataset, language });
          }}
          fill
          disabled={submitDisabled}
          data-test-subj="advancedSelectorConfirmButton"
        >
          <FormattedMessage
            id="data.explorer.datasetSelector.advancedSelector.confirm"
            defaultMessage="Select Data"
          />
        </EuiButton>
      </EuiModalFooter>
    </>
  );
};
