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

import inquirer from 'inquirer';

import { Provider } from '..';
import { Colors } from '../../util';

export class UserProvider extends Provider<UserPayload> {
    
    constructor() {
        super('user', '/users');
    }
    
    get = async (input: string): Promise<UserPayload> => await this.fetch([{
        key: 'netid',
        value: input,
        query: 'param'
    }], 'get');

        
    report = async (input: string, data: UserPayload): Promise<string> => {
        let matches = data.length;
        let exact = data.find(user => user.properties.cn[0] === input);
        if (exact) return this.printRecord(exact);

        console.log(`🔍 Found ${matches} matching user(s) with the NetID ${this.logger.wrap(Colors.GREEN, `"${input}"`)}`);
        return await inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'id',
                    message: 'Select the user you want to inspect',
                    choices: data
                        .sort((a, b) => a
                            .properties
                            .cn[0]
                            .localeCompare(b
                                .properties
                                .cn[0]))
                        .map(user => ({
                            name: `${user.properties.displayname[0]} (${user.properties.cn[0]})`,
                            value: user.properties.cn[0]
                        })),
                },
            ])
            .then(choice => this.printRecord(data.find(user => user.properties.cn[0] === choice.id)));
    }

    private printRecord = ({ properties: data }: UserRecord) => {
        let groups = data
            .memberof
            .map(group => [...new Set(group
                .split(',')
                .reverse()
                .slice(5)
                .map(part => part.split('=')[1]))]
                .join(' -> '))
            .join('\n ▬ ');

        let employeeInfo = (!!data.title && (!!data.title[0].length && data.title[0] !== 'Student'))
            ? {
                dept: data.department[0],
                title: data.title[0],
                location: data.l[0],
                street: data.streetaddress[0]
            } : null;

        let payload =
            `${this.logger.wrap(Colors.BLUE, `👨 ${data.displayname[0]}`)} ${this.logger.wrap(Colors.DIM, `(${data.userprincipalname[0]})`)}` +
            `\n${data.description[0].includes(data.displayname[0])
                ? data.description[0]
                    .split(data.displayname[0])[1]
                    .split(' - ')[1]
                    .trim()
                : data.description[0]}` +
            `\n\n${this.logger.wrap((Colors.BLUE + Colors.BRIGHT) as any, `Email:`)}` +
            `\n${data.mail[0]}` +
            (employeeInfo
                ? `\n\n${this.logger.wrap((Colors.BLUE + Colors.BRIGHT) as any, `Employee Information:`)}`
                    + `\n${employeeInfo.dept}`
                    + `\n${employeeInfo.title}`
                    + `\n${employeeInfo.location}, ${employeeInfo.street}`
                : '') +
            `\n\n${this.logger.wrap((Colors.BLUE + Colors.BRIGHT) as any, `Groups:`)}` +
            `\n ▬ ${groups}`;

        return payload;
    }

}

export type UserPayload = UserRecord[];

export type UserRecord = {
    path: string;
    properties: {
        objectsid: string[];
        displayname: string[];
        usncreated: number[];
        loginshell?: string[];
        countrycode: number[];
        lastlogon: number[];
        extensionattribute1?: string[];
        whencreated: Date[];
        mailnickname?: string[];
        objectcategory: string[];
        primarygroupid: number[];
        proxyaddresses?: string[];
        pwdlastset: number[];
        instancetype: number[];
        givenname: string[];
        legacyexchangedn?: string[];
        cn: string[];
        samaccountname: string[];
        msexchrecipientdisplaytype?: number[];
        lastlogontimestamp: number[];
        objectclass: string[];
        streetaddress?: string[];
        adspath: string[];
        badpwdcount: number[];
        distinguishedname: string[];
        name: string[];
        useraccountcontrol: number[];
        codepage: number[];
        msexchumdtmfmap?: string[];
        description: string[];
        "msds-externaldirectoryobjectid": string[];
        homedirectory?: string[];
        msexchversion?: number[];
        sn: string[];
        samaccounttype: number[];
        memberof: string[];
        badpasswordtime: number[];
        lockouttime?: number[];
        dscorepropagationdata: Date[];
        msexchrecipienttypedetails?: number[];
        "ms-ds-consistencyguid": string[];
        whenchanged: Date[];
        st?: string[];
        title?: string[];
        showinaddressbook?: string[];
        homedrive?: string[];
        altsecurityidentities?: string[];
        userprincipalname: string[];
        objectguid: string[];
        postalcode?: string[];
        unixhomedirectory?: string[];
        extensionattribute2?: string[];
        mail: string[];
        msexchremoterecipienttype?: number[];
        department?: string[];
        l?: string[];
        uidnumber?: number[];
        targetaddress?: string[];
        accountexpires: number[];
        msexchpoliciesexcluded?: string[];
        gidnumber?: number[];
        usnchanged: number[];
        logoncount: number[];
        extensionattribute11?: string[];
        lastlogoff?: number[];
        mstslicenseversion3?: string[];
        mstslicenseversion2?: string[];
        mstsmanagingls?: string[];
        mstsexpiredate?: Date[];
        mstslicenseversion?: string[];
    }
}    