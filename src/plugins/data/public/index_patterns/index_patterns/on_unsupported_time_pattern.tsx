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

import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';
import React from 'react';
import { CoreStart } from 'opensearch-dashboards/public';
import { toMountPoint } from '../../../../opensearch_dashboards_react/public';

export const onUnsupportedTimePattern = (
  toasts: CoreStart['notifications']['toasts'],
  navigateToApp: CoreStart['application']['navigateToApp']
) => ({ id, title, index }: { id: string; title: string; index: string }) => {
  const warningTitle = i18n.translate('data.indexPatterns.warningTitle', {
    defaultMessage: 'Support for time interval index patterns removed',
  });

  const warningText = i18n.translate('data.indexPatterns.warningText', {
    defaultMessage:
      'Currently querying all indices matching {index}. {title} should be migrated to a wildcard-based index pattern.',
    values: { title, index },
  });

  // osdUrl was added to this service in #35262 before it was de-angularized, and merged in a PR
  // directly against the 7.x branch. Index patterns were de-angularized in #39247, and in order
  // to preserve the functionality from #35262 we need to get the injector here just for osdUrl.
  // This has all been removed as of 8.0.

  // 2019-12-01 The usage of osdUrl had to be removed due to the transition to NP.
  // It's now temporarily replaced by a simple replace of the single argument used by all URLs.
  // Once osdUrl is migrated to NP, this can be updated.

  toasts.addWarning({
    title: warningTitle,
    text: toMountPoint(
      <div>
        <EuiText size="s">
          <p>{warningText}</p>
        </EuiText>
        <EuiFlexGroup justifyContent="flexEnd" gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiButton
              size="s"
              onClick={() =>
                navigateToApp('management', {
                  path: `/opensearch-dashboards/index_patterns/index_pattern/${id! || ''}`,
                })
              }
            >
              <FormattedMessage
                id="data.indexPatterns.editIndexPattern"
                defaultMessage="Edit index pattern"
              />
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    ),
  });
};
