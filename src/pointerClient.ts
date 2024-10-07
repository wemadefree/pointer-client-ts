import { IEntityMeta, IEntityPropertyMeta } from './typing/entityMetaTypings';
import { IEntityAssociation } from './typing/entityAssociation';
import { IAvailableEntities, IAvailableEntityProperties } from './typing/availableEntities';
import { AuthClient } from './auth-handlers/authClient';
import AxiosClient from './axiosClient';

export class PointerClient extends AxiosClient {
    availableEntities: IAvailableEntities = {};
    tenantId: string;
    
    constructor(tenantId: string, baseUrl: string, authClient: AuthClient) {
        super(baseUrl, authClient);
        this.tenantId = tenantId;
    }

    /**
     * 
     * Entities
     * 
     */

    async listEntityRows(entityId: string, query?: {}) {
        if (await this.checkIfEndpointExists(entityId)) {
            return await this.get(`/${this.availableEntities[entityId].apiId}/tenants/${this.tenantId}/${entityId}`, query)
        }
        
        return this.entityError(entityId)
    }

    async getEntityRow(entityId: string, rowId: string) {
        if (await this.checkIfEndpointExists(entityId)) {
            return await this.get(`/${this.availableEntities[entityId].apiId}/tenants/${this.tenantId}/${entityId}/${rowId}`)
        }

        return this.entityError(entityId)
    }

    async createEntityRow(entityId: string, data: Object) {
        if (await this.checkIfEndpointExists(entityId)) {
            return await this.post(`/${this.availableEntities[entityId].apiId}/tenants/${this.tenantId}/${entityId}`, data)
        }

        return this.entityError(entityId)
    }

    async updateEntityRow(entityId: string, rowId: string, data: Object) {
        if (await this.checkIfEndpointExists(entityId)) {
            return await this.patch(`/${this.availableEntities[entityId].apiId}/tenants/${this.tenantId}/${entityId}/${rowId}`, data)
        }

        return this.entityError(entityId)
    }

    async updateEntityRowAssociations(entityId: string, rowId: string, data: IEntityAssociation) {
        if (await this.checkIfEndpointExists(entityId)) {
            return await this.patch(`/${this.availableEntities[entityId].apiId}/tenants/${this.tenantId}/${entityId}/${rowId}/associations`, data)
        }

        return this.entityError(entityId)
    }

    async deleteEntityRow(entityId: string, rowId: string) {
        if (await this.checkIfEndpointExists(entityId)) {
            return await this.patch(`/${this.availableEntities[entityId].apiId}/tenants/${this.tenantId}/${entityId}/${rowId}`, {isArchived: true})
        }

        return this.entityError(entityId)
    }


    /**
     * 
     * Helpers
     * 
     */

    async checkIfEndpointExists(entityId: string) {
        if (Object.keys(this.availableEntities).length === 0) {
            await this.getAvailableEndpoints()
        }

        return this.availableEntities[entityId] ? true : false
    }

    async getEnumLabel(entityId: string, propertyId: string, value: string | number | null) {
        try {
            if (await this.checkIfEndpointExists(entityId)) {
                const property = this.availableEntities[entityId].properties.find((property) => property.id === propertyId)
                if (property && property.enumOptions) {
                    const enumOption = property.enumOptions.find((option) => option.value === value)
                    if (enumOption) {
                        return enumOption.label
                    }
                    throw new Error(`Enum option ${value} not found for property ${propertyId}`)
                } else if (property) {
                    throw new Error(`Property ${propertyId} is not an enum`)
                }
                throw new Error(`Property ${propertyId} not found for entity ${entityId}`)
            }
            throw new Error(`Entity ${entityId} not found`)
        }  catch (error) {
            console.error(error)
            return value
        }
    }

    async getAvailableEndpoints() {
        const result = await this.get(`/xrm-tenants/v1/tenants/${this.tenantId}/tenantMeta`);
        if (result && result.entitiesMeta) {
            result.entitiesMeta.forEach((entityMeta: IEntityMeta) => {
                this.availableEntities[entityMeta.id] = {
                    id: entityMeta.id,
                    apiId: entityMeta.apiId,
                    properties: [] as IAvailableEntityProperties[]
                }
                if (entityMeta.properties) {
                    entityMeta.properties.forEach((property: IEntityPropertyMeta) => {
                        const propertyObj: IAvailableEntityProperties = {
                            id: property.id,
                            name: property.name || '',
                            dataTypeId: property.dataTypeId || '',
                            jsonBaseType: property.jsonBaseType || '',
                            isRequired: property.isRequired ?? false,
                        }
                        if (property.foreignKey) {
                            propertyObj.foreignKey = {
                                ...property.foreignKey,
                                alwaysIncludeGet: property.foreignKey.alwaysIncludeGet ?? false
                            };
                        }
                        if (property.defaultValue) {
                            propertyObj.defaultValue = property.defaultValue;
                        }
                        if (property.enumOptions) {;
                            propertyObj.enumOptions = property.enumOptions;
                        }
                        this.availableEntities[entityMeta.id].properties.push(propertyObj)
                    })
                }
            }) 
        }
    }

    async getEntityProperties(entityId: string) {
        if (await this.checkIfEndpointExists(entityId)) {
            return this.availableEntities[entityId].properties
        }

        return this.entityError(entityId)
    }

    async getLoginOptions() {
        return this.authClient.loginPossibilities;
    }

    async login(providerId: string = 'google.com') {
        if (this.authClient.login) {
            await this.authClient.login(providerId);
        }
    }

    entityError(entityId: string) {
        return {code: 404, message: `Entity ${entityId} not found`}
    }
}

export interface PointerClient {
    listEntityData(entityId: string, query?: {}): Promise<any>;
    getEntityData(entityId: string, rowId: string): Promise<any>;
    createEntityRow(entityId: string, data: Object): Promise<any>;
    updateEntityRow(entityId: string, rowId: string, data: Object): Promise<any>;
    updateEntityRowAssociations(entityId: string, rowId: string, data: IEntityAssociation): Promise<any>;

    // Helpers
    checkIfEndpointExists(entityId: string): Promise<boolean>;
    getAvailableEndpoints(): Promise<void>;
    getEntityProperties(entityId: string): Promise<IAvailableEntityProperties[]>;
    entityError(entityId: string): any;

    // Aliases
    getEntityData: typeof PointerClient.prototype.getEntityRow;
    listEntityData: typeof PointerClient.prototype.listEntityRows;
}


// Alias for getEntityData and listEntityData
PointerClient.prototype.getEntityData = PointerClient.prototype.getEntityRow;
PointerClient.prototype.listEntityData = PointerClient.prototype.listEntityRows;
