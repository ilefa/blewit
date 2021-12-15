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

export * from './logger';

export type BlewItMode = 'none' | 'user' | 'device' | 'group';

export type HttpMethod = 'get' | 'post' | 'delete' | 'put' | 'patch';

export type HttpQueryType = 'body' | 'param';

export type DataParameter<T> = { query: HttpQueryType, key: string, value: T };

export const getCurrentMode = (user: string | null, device: string | null, group: string | null): BlewItMode => {
    if (!user && !device && !group)
        return 'none';

    if (user && !device && !group)
        return 'user';

    if (!user && device && !group)
        return 'device';

    if (!user && !device && group)
        return 'group';

    return null;
}