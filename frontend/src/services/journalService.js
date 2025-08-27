import api from './api';

// Get all journals
export const getJournals = async () => {
  try {
    const response = await api.get('/journals');
    return response.data;
  } catch (error) {
    console.error('Error fetching journals:', error);
    throw error;
  }
};

// Get a single journal by ID
export const getJournal = async (id) => {
  try {
    const response = await api.get(`/journals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching journal:', error);
    throw error;
  }
};

// Create a new journal
export const createJournal = async (journalData) => {
  try {
    const response = await api.post('/journals', journalData);
    return response.data;
  } catch (error) {
    console.error('Error creating journal:', error);
    throw error;
  }
};

// Update an existing journal
export const updateJournal = async (id, journalData) => {
  try {
    const response = await api.put(`/journals/${id}`, journalData);
    return response.data;
  } catch (error) {
    console.error('Error updating journal:', error);
    throw error;
  }
};

// Delete a journal
export const deleteJournal = async (id) => {
  try {
    const response = await api.delete(`/journals/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting journal:', error);
    throw error;
  }
};

// Get journal details
export const getJournalDetails = async (journalId) => {
  try {
    const response = await api.get(`/journals/${journalId}/details`);
    return response.data;
  } catch (error) {
    console.error('Error fetching journal details:', error);
    throw error;
  }
};

// Create journal detail
export const createJournalDetail = async (journalId, detailData) => {
  try {
    const response = await api.post(`/journals/${journalId}/details`, detailData);
    return response.data;
  } catch (error) {
    console.error('Error creating journal detail:', error);
    throw error;
  }
};

// Update journal detail
export const updateJournalDetail = async (journalId, detailId, detailData) => {
  try {
    const response = await api.put(`/journals/${journalId}/details/${detailId}`, detailData);
    return response.data;
  } catch (error) {
    console.error('Error updating journal detail:', error);
    throw error;
  }
};

// Delete journal detail
export const deleteJournalDetail = async (journalId, detailId) => {
  try {
    const response = await api.delete(`/journals/${journalId}/details/${detailId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting journal detail:', error);
    throw error;
  }
}; 