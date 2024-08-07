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

import {
  EuiForm,
  EuiCompressedFormRow,
  EuiCompressedFieldText,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiSmallButton,
  EuiModalFooter,
  EuiSmallButtonEmpty,
} from '@elastic/eui';
import React, { Component } from 'react';

interface Props {
  onDone: (message: string) => void;
  onCancel: () => void;
}

interface State {
  message?: string;
}

export class GetMessageModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <EuiModalHeader>
          <EuiModalHeaderTitle>Enter your message</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiModalBody>
          <EuiForm>
            <EuiCompressedFormRow label="Message">
              <EuiCompressedFieldText
                name="popfirst"
                value={this.state.message}
                onChange={(e) => this.setState({ message: e.target.value })}
              />
            </EuiCompressedFormRow>
          </EuiForm>
        </EuiModalBody>

        <EuiModalFooter>
          <EuiSmallButtonEmpty onClick={this.props.onCancel}>Cancel</EuiSmallButtonEmpty>

          <EuiSmallButton
            isDisabled={!this.state.message}
            onClick={() => {
              if (this.state.message) {
                this.props.onDone(this.state.message);
              }
            }}
            fill
          >
            Done
          </EuiSmallButton>
        </EuiModalFooter>
      </React.Fragment>
    );
  }
}
