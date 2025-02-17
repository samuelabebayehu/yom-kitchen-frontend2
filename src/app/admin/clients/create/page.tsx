// pages/admin/clients/create.tsx
'use client';

import React, { useState } from 'react';
import ClientForm from '@/components/client-form';

const CreateClientPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateClient = async (values: any) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      console.log("onSubmit in parent component called with values:", values); // Debugging log
      // Simulate API call (replace with your actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccessMessage("Client created successfully!");
    } catch (e: any) {
      setError(e.message || "Error creating client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create New Client</h1>
      <ClientForm
        onSubmit={handleCreateClient} // Passing onSubmit prop
        submitButtonText="Create Client"
        loading={loading}
        error={error}
        successMessage={successMessage}
      />
    </div>
  );
};

export default CreateClientPage;