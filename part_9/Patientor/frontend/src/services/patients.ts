import axios from "axios";
import { Patient, PatientFormValues, Entry, NewEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getById = async (id: string) => {
  const { data } = await axios.get(`${apiBaseUrl}/patients/${id}`);
  return data;
}

const addEntry = async (patientId: string, entry: NewEntry): Promise<Entry> => {
  const { data } = await axios.post (
    `${apiBaseUrl}/patients/${patientId}/entries`,
    entry
  );
  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

export default {
  getAll, 
  getById, 
  create, 
  addEntry
};

