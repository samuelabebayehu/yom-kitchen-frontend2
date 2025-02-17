'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientForm from '@/components/client-form'; // Import reusable ClientForm

import { clientSchema } from '@/lib/validations/client';
import { z } from 'zod';
import Link from 'next/link';
// import { Client } from '@/app/admin/clients/page'; // Assuming your Client interface is defined here

const EditClientPage = () => {
    const params = useParams();
    const clientId = Number(params.id); // Get client ID from URL params
    const [initialValues, setInitialValues] = useState<Client | null>(null); // State to hold client data for editing
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchClient = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('admin_jwt_token');
                const response = await fetch(`${apiBaseURL}/admin/clients/${clientId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    if (response.status === 404) {
                        router.push('/admin/clients'); // Redirect to client list if client not found
                        return;
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to fetch client: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setInitialValues(data as Client); // Set initial values for the form
            } catch (err: any) {
                setError(err.message as string);
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [clientId, router, apiBaseURL]);

    const handleUpdateClient = async (values: z.infer<typeof clientSchema>) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        const token = localStorage.getItem('admin_jwt_token');

        try {
            const response = await fetch(`${apiBaseURL}/admin/clients/${clientId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Client update failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setSuccessMessage(data.message); // Set success message for ClientForm to handle redirect
        } catch (err: any) {
            setError(err.message as string);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        router.push('/admin/clients'); // Redirect to client list on cancel
    };

    if (loading && !initialValues) {
        return <div>Loading client data...</div>; // Or your loading spinner
    }

    if (!initialValues && error) {
        return (
            <div className="container mx-auto p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">Error loading client data: {error}</span>
                </div>
                <Link href="/admin/clients" className="text-blue-500 hover:underline">
                    &larr; Back to Client List
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Client</h1>
            <div className="mb-8 p-6 bg-white shadow rounded">
                <ClientForm
                    initialValues={initialValues} // Pass fetched client data as initialValues
                    onSubmit={handleUpdateClient}
                    submitButtonText="Update Client"
                    cancelButtonText="Cancel"
                    loading={loading}
                    error={error}
                    successMessage={successMessage}
                    onCancel={handleCancelEdit} // Optional cancel handler
                />
            </div>
            <div className="mt-4">
                <Link href="/admin/clients" className="text-blue-500 hover:underline">
                    &larr; Back to Client List
                </Link>
            </div>
        </div>
    );
};

export default EditClientPage;