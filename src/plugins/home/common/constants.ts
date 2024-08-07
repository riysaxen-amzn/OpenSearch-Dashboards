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

export const PLUGIN_ID = 'home';
export const HOME_APP_BASE_PATH = `/app/${PLUGIN_ID}`;
export const USE_NEW_HOME_PAGE = 'home:useNewHomePage';
export const IMPORT_SAMPLE_DATA_APP_ID = 'import_sample_data';
export const HOME_PAGE_ID = 'osd_homepage';
export enum SECTIONS {
  GET_STARTED = `get_started`,
  SERVICE_CARDS = `service_cards`,
  RECENTLY_VIEWED = `recently_viewed`,
}

export enum HOME_CONTENT_AREAS {
  GET_STARTED = `${HOME_PAGE_ID}/${SECTIONS.GET_STARTED}`,
  SERVICE_CARDS = `${HOME_PAGE_ID}/${SECTIONS.SERVICE_CARDS}`,
  RECENTLY_VIEWED = `${HOME_PAGE_ID}/${SECTIONS.RECENTLY_VIEWED}`,
}
