import axios from 'axios';

export interface ICompany {
    id: number;
    company_name: string;
    liked: boolean;
}

export interface ICollection {
    id: string;
    collection_name: string;
    companies: ICompany[];
    total: number;
}

export interface ICompanyBatchResponse {
    companies: ICompany[];
}

const BASE_URL = 'http://localhost:8000';

export async function getCompanies(offset?: number, limit?: number): Promise<ICompanyBatchResponse> {
    try {
        const response = await axios.get(`${BASE_URL}/companies`, {
            params: {
                offset,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

export async function getCollectionCompaniesById(collection: string): Promise<number[]>{
    try{
        const response = await axios.get(`${BASE_URL}/collections/ids/${collection}`);
        return response.data;
    }
    catch (error) {
        console.error('Error fetching collection companies', error);
        throw error;
    }
}

export async function getCollectionsById(id: string, offset?: number, limit?: number): Promise<ICollection> {
    try {
        const response = await axios.get(`${BASE_URL}/collections/${id}`, {
            params: {
                offset,
                limit,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}

export async function getCollectionsMetadata(): Promise<ICollection[]> {
    try {
        const response = await axios.get(`${BASE_URL}/collections`);
        return response.data;
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
}


//This function takes a list of company IDs and a collection ID and adds the companies to the collection
export async function setCompanyToList(ids: number[], collection: string): Promise<void>{
    console.log(ids)
    try{
        await axios.put(`${BASE_URL}/collections/${collection}`, ids);
        return 
    } catch (error){
        console.error('Error setting company to list: ', error)
        throw error
    }
}
