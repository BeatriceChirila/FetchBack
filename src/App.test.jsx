import { render, screen, waitFor, fireEvent, act, within } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import App from './App';

// Mock the Global Fetch
global.fetch = vi.fn();

describe('VetDashboard Navigation & Load', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });

  test('successfully navigates from Home to Dashboard and loads pets', async () => {
    // Mock the initial fetch response (what the server sends when Dashboard loads)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: 1,
        unidentified: 1,
        contacted: 0,
        data: [{ 
          id: 1, 
          species: 'Dog', 
          breed: 'Golden Retriever', 
          status: 'Unidentified',
          dateAdmitted: 'Apr 12'
        }]
      }),
    });

    // Render app
    await act(async () => {
      render(<App />);
    });

    // click vet login
    const loginBtn = screen.getByText('Vet Login');
    await act(async () => {
      fireEvent.click(loginBtn);
    });

    // assert
    await waitFor(() => {
      expect(screen.getByText(/Animals in clinic custody/i)).toBeInTheDocument();
      expect(screen.getByText(/Golden Retriever/i)).toBeInTheDocument();
    });

    const totalBox = screen.getByText(/Total Pets/i).closest('.summary-box');
    expect(within(totalBox).getByText('1')).toBeInTheDocument();
  });
});




describe('VetDashboard CRUD Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });

  test('updates status and refreshes summary boxes', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: 1, unidentified: 1, contacted: 0,
        data: [{ id: 1, species: 'Dog', status: 'Unidentified' }]
      }),
    });

    await act(async () => { render(<App />); });
    await act(async () => { fireEvent.click(screen.getByText('Vet Login')); });

    const editBtn = await screen.findByTitle(/update/i);
    await act(async () => { fireEvent.click(editBtn); });

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, status: 'Owner Contacted' }) });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: 1, unidentified: 0, contacted: 1,
        data: [{ id: 1, species: 'Dog', status: 'Owner Contacted' }]
      }),
    });

    await act(async () => { 
      fireEvent.click(screen.getByRole('button', { name: /Save|Update/i })); 
    });

    await waitFor(() => {
      const label = screen.getByText('Owner Contacted', { selector: '.summary-label' });
      const contactedBox = label.closest('.summary-box');
      expect(within(contactedBox).getByText('1')).toBeInTheDocument();
    });
  });

  test('deletes a pet and reduces total count', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: 1, unidentified: 1, contacted: 0,
        data: [{ id: 1, species: 'Dog', status: 'Unidentified' }]
      }),
    });

    await act(async () => { render(<App />); });
    await act(async () => { fireEvent.click(screen.getByText('Vet Login')); });

    const deleteBtn = await screen.findByTitle(/delete/i);
    await act(async () => { fireEvent.click(deleteBtn); });

    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ message: "Deleted" }) });
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: 0, unidentified: 0, contacted: 0, data: [] }),
    });

    await act(async () => { 
      fireEvent.click(screen.getByText(/Yes, Erase Pet/i)); 
    });

    await waitFor(() => {
      const label = screen.getByText('Total Pets', { selector: '.summary-label' });
      const totalBox = label.closest('.summary-box');
      expect(within(totalBox).getByText('0')).toBeInTheDocument();
    });
  });
});





describe('VetDashboard Addition & Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });

  test('successfully adds a new pet', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: 0, unidentified: 0, contacted: 0, data: [] }),
    });

    await act(async () => { render(<App />); });
    await act(async () => { fireEvent.click(screen.getByText('Vet Login')); });
    await act(async () => { fireEvent.click(screen.getByText(/Add new/i)); });

    const newPet = { id: 101, species: 'Dog', status: 'Unidentified' };
    
    fetch.mockResolvedValueOnce({ ok: true, json: async () => newPet });
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ total: 1, unidentified: 1, contacted: 0, data: [newPet] }),
    });


    const speciesSelect = screen.getByRole('combobox');
    fireEvent.change(speciesSelect, { target: { value: 'Dog' } });

    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'Golden Retriever' } }); // Breed
    fireEvent.change(textboxes[1], { target: { value: 'Yellow' } });           // Coat colour
    fireEvent.change(textboxes[2], { target: { value: 'Brown' } });            // Eye colour
    fireEvent.change(textboxes[3], { target: { value: 'Very friendly' } });    // Traits

    const ageInput = screen.getByRole('spinbutton');
    fireEvent.change(ageInput, { target: { value: '3' } });

    //Fake a Photo Upload
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(['dummy content'], 'dog.png', { type: 'image/png' });
    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    const uploadBtn = screen.getByRole('button', { name: /Upload pet/i });
    await act(async () => {
      fireEvent.click(uploadBtn);
    });

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/Animals in clinic custody/i)).toBeInTheDocument();
      
      const label = screen.getByText('Total Pets', { selector: '.summary-label' });
      const totalBox = label.closest('.summary-box');
      expect(within(totalBox).getByText('1')).toBeInTheDocument();
    });
  });


  test('handles photo validation alert', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ total: 0, data: [] }) });
    
    await act(async () => { render(<App />); });
    await act(async () => { fireEvent.click(screen.getByText('Vet Login')); });
    await act(async () => { fireEvent.click(screen.getByText(/Add new/i)); });

    const uploadBtn = screen.getByRole('button', { name: /Upload pet/i });
    await act(async () => { 
      fireEvent.click(uploadBtn); 
    });

    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith("Please upload a photo of the pet.");
    });
  });
});