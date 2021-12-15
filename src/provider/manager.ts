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

import { Provider } from '.';
import { BlewItMode } from '../util';

export class ProviderManager {
    
    protected providers: Provider<any>[];

    constructor() {
        this.providers = [];
    }

    register = <T>(module: Provider<T>) => this.providers.push(module);

    getProvider = (mode: BlewItMode) => this.providers.find(m => m.mode === mode);

}