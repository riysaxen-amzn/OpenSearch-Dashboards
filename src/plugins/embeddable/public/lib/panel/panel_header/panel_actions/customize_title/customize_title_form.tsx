/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { ChangeEvent } from 'react';

import { EuiSmallButtonEmpty, EuiCompressedFieldText, EuiCompressedFormRow } from '@elastic/eui';
import { FormattedMessage } from '@osd/i18n/react';
import { i18n } from '@osd/i18n';

export interface PanelOptionsMenuFormProps {
  title?: string;
  onReset: () => void;
  onUpdatePanelTitle: (newPanelTitle: string) => void;
}

export function CustomizeTitleForm({
  title,
  onReset,
  onUpdatePanelTitle,
}: PanelOptionsMenuFormProps) {
  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    onUpdatePanelTitle(event.target.value);
  }

  return (
    <div className="embPanel__optionsMenuForm" data-test-subj="dashboardPanelTitleInputMenuItem">
      <EuiCompressedFormRow
        label={i18n.translate(
          'embeddableApi.customizeTitle.optionsMenuForm.panelTitleFormRowLabel',
          {
            defaultMessage: 'Panel title',
          }
        )}
      >
        <EuiCompressedFieldText
          id="panelTitleInput"
          data-test-subj="customEmbeddablePanelTitleInput"
          name="min"
          type="text"
          value={title}
          onChange={onInputChange}
          aria-label={i18n.translate(
            'embeddableApi.customizeTitle.optionsMenuForm.panelTitleInputAriaLabel',
            {
              defaultMessage: 'Changes to this input are applied immediately. Press enter to exit.',
            }
          )}
        />
      </EuiCompressedFormRow>

      <EuiSmallButtonEmpty data-test-subj="resetCustomEmbeddablePanelTitle" onClick={onReset}>
        <FormattedMessage
          id="embeddableApi.customizeTitle.optionsMenuForm.resetCustomDashboardButtonLabel"
          defaultMessage="Reset title"
        />
      </EuiSmallButtonEmpty>
    </div>
  );
}
