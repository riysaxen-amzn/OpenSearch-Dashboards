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

import React from 'react';
import { History } from 'history';
import { i18n } from '@osd/i18n';
import { EuiLoadingSpinner } from '@elastic/eui';
import ReactDOM from 'react-dom';

import { ApplicationStart, HttpStart, ToastsSetup } from 'opensearch-dashboards/public';
import { SavedObjectNotFound } from '..';

const ErrorRenderer = (props: { children: string }) => (
  <React.Suspense fallback={<EuiLoadingSpinner />}>
    <span>{props.children}</span>
  </React.Suspense>
);

interface Mapping {
  [key: string]: string | { app: string; path: string };
}

function addNotFoundToPath(path: string, error: SavedObjectNotFound) {
  return (
    path +
    (path.indexOf('?') >= 0 ? '&' : '?') +
    `notFound=${error.savedObjectType}&notFoundMessage=${error.message}`
  );
}

/**
 * Creates an error handler that will redirect to a url when a SavedObjectNotFound
 * error is thrown
 */
export function redirectWhenMissing({
  history,
  navigateToApp,
  basePath,
  mapping,
  toastNotifications,
  onBeforeRedirect,
}: {
  history: History;
  navigateToApp: ApplicationStart['navigateToApp'];
  basePath: HttpStart['basePath'];
  /**
   * a mapping of url's to redirect to based on the saved object that
   * couldn't be found, or just a string that will be used for all types
   */
  mapping: string | Mapping;
  /**
   * Toast notifications service to show toasts in error cases.
   */
  toastNotifications: ToastsSetup;
  /**
   * Optional callback invoked directly before a redirect is triggered
   */
  onBeforeRedirect?: (error: SavedObjectNotFound) => void;
}) {
  let localMappingObject: Mapping;

  if (typeof mapping === 'string') {
    localMappingObject = { '*': mapping };
  } else {
    localMappingObject = mapping;
  }

  return (error: SavedObjectNotFound) => {
    // if this error is not "404", rethrow
    // we can't check "error instanceof SavedObjectNotFound" since this class can live in a separate bundle
    // and the error will be an instance of other class with the same interface (actually the copy of SavedObjectNotFound class)
    if (!error.savedObjectType) {
      throw error;
    }

    let redirectTarget =
      localMappingObject[error.savedObjectType] || localMappingObject['*'] || '/';
    if (typeof redirectTarget !== 'string') {
      redirectTarget.path = addNotFoundToPath(redirectTarget.path, error);
    } else {
      redirectTarget = addNotFoundToPath(redirectTarget, error);
    }

    toastNotifications.addWarning({
      title: i18n.translate(
        'opensearch_dashboards_utils.history.savedObjectIsMissingNotificationMessage',
        {
          defaultMessage: 'Saved object is missing',
        }
      ),
      text: (element: HTMLElement) => {
        ReactDOM.render(<ErrorRenderer>{error.message}</ErrorRenderer>, element);
        return () => ReactDOM.unmountComponentAtNode(element);
      },
    });

    if (onBeforeRedirect) {
      onBeforeRedirect(error);
    }
    if (typeof redirectTarget !== 'string') {
      if (redirectTarget.app === 'opensearch-dashboards') {
        // exception for OpenSearch Dashboards app because redirect won't work right otherwise
        window.location.href = basePath.prepend(`/app/opensearch-dashboards${redirectTarget.path}`);
      } else {
        navigateToApp(redirectTarget.app, { path: redirectTarget.path });
      }
    } else {
      history.replace(redirectTarget);
    }
  };
}
