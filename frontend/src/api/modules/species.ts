import type { SpeciesFormData, AddSpeciesResponse } from '@/api/apiTypes';

import httpClient from '@/api/axiosSetup';
import { add } from 'date-fns';

export const speciesApi = {
    addSpecies: (data: SpeciesFormData) =>
        httpClient.post<AddSpeciesResponse>('/api/manage_species/species-management/new', data, {
            headers: { useAuth: true },
        })

};