/*
 * Copyright (c) 2021 ILEFA Labs
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import axios from 'axios';

import {
    BlewItMode,
    DataParameter,
    HttpMethod,
    Logger
} from '../util';

export abstract class Provider<R> {

    protected logger: Logger;

    constructor(public mode: BlewItMode,
                protected path: string) {
        this.logger = new Logger();
    }

    abstract get(input: string): Promise<R>;

    abstract report(input: string, data: R): Promise<string>;

    protected fetch = async <T>(data: DataParameter<T>[], method: HttpMethod): Promise<R> => {
        let { path, body } = this.createPath(data);
        return await axios[method](path, body)
            .then(res => res.data)
            .catch(_ => null);
    };

    protected createPath = <T>(data: DataParameter<T>[]) => {
        let base = this.path;
        let body = {};
        for (let param of data) {
            if (param.query === 'param')
                base += `?${param.key}=${param.value}`;
            else
                body[param.key] = param.value;
        }

        return { path: base, body }
    }

}