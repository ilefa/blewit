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

import { Provider } from '..';
import { Colors } from '../../util';

export class DeviceProvider extends Provider<DevicePayload> {
    
    constructor() {
        super('device', '/computers');
    }
    
    get = async (input: string): Promise<DevicePayload> => await this.fetch([{
        key: 'name',
        value: input,
        query: 'param'
    }], 'get');
    
    report = (_input: string, props: DevicePayload): Promise<string> => {
        if (!props[0].properties.serviceprincipalname)
            return new Promise((res, _rej) => res(`🔍 Could not locate a device with this identifier.`));
            
        let data = props[0].properties;
        let adPath = data
            .adspath[0]
            .split(',')
            .slice(1)
            .reverse()
            .slice(4)
            .map(ent => ent.split('OU=')[1])
            .join(' -> ');

        let managed = data.managedby
            ? data
                .managedby[0]
                .split(',')[0]
                .split('CN=')[1]
            : null;

        let payload =
            `${this.logger.wrap(Colors.BLUE, `💻 ${data.name[0]}`)} ${this.logger.wrap(Colors.DIM, `(${data.dnshostname[0]})`)}` +
            `\n${data.description}` +
            (managed
                ? `\n\n${this.logger.wrap((Colors.BLUE + Colors.BRIGHT) as any, `Managed By:`)}`
                    + `\n${managed}`
                : '') +
            `\n\n${this.logger.wrap((Colors.BLUE + Colors.BRIGHT) as any, `Operating System:`)}` +
            `\n${data.operatingsystem[0]} (${data.operatingsystemversion[0].replace(/[()]/g, '').replace(/\s/g, ' - ')})` +
            `\n\n${this.logger.wrap((Colors.BLUE + Colors.BRIGHT) as any, `Active Directory OU:`)}` +
            `\n${data.distinguishedname[0].split(',')[1].split(',')[0].split('OU=')[1]}` +
            `\n\n${this.logger.wrap((Colors.BLUE + Colors.BRIGHT) as any, `Active Directory Path:`)}` +
            `\n${adPath}`;

        return new Promise((res, _rej) => res(payload.trim()));
    }

}

export type DevicePayload = [
    {
        path: string;
        properties: {
            objectsid: string[];
            countrycode: number[];
            usncreated: number[];
            lastlogoff: number[];
            accountexpires: number[];
            badpwdcount: number[];
            whencreated: Date[];
            primarygroupid: number[];
            objectcategory: string[];
            logoncount: number[];
            pwdlastset: number[];
            instancetype: number[];
            cn: string[];
            iscriticalsystemobject: boolean[];
            lastlogontimestamp: number[];
            objectclass: string[];
            lastlogon: number[];
            distinguishedname: string[];
            name: string[];
            useraccountcontrol: number[];
            codepage: number[];
            description: string[];
            "ms-mcs-admpwd": string[];
            "ms-mcs-admpwdexpirationtime": number[];
            badpasswordtime: number[];
            dscorepropagationdata: Date[];
            operatingsystemversion: string[];
            serviceprincipalname: string[];
            whenchanged: Date[];
            dnshostname: string[];
            samaccounttype: number[];
            adspath: string[];
            objectguid: string[];
            "msds-supportedencryptiontypes": number[];
            localpolicyflags: number[];
            usercertificate: string[];
            usnchanged: number[];
            operatingsystem: string[];
            samaccountname: string[];
            managedby?: string[];
        }
    }
]