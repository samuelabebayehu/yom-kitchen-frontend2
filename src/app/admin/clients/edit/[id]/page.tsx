'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ClientForm from '@/components/admin/client-form'; 
import {clientSchema}  from '@/lib/validations/client';
import { z } from 'zod';
import Link from 'next/link';
import withAuth from '@/lib/auth';



const EditClientPage = () => {
    const params = useParams();
    const clientId = Number(params.id); 
    const [initialValues, setInitialValues] = useState<z.infer<typeof clientSchema> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const apiBaseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

    useEffect(() => {
        const fetchClient = async () => {
            const axiosInstance = withAuth();
            setLoading(true);
            setError(null);
            try {
              
                const response = await axiosInstance.get(`${apiBaseURL}/admin/clients/${clientId}`);
                if (!response.statusText.includes('OK')) {
                    if (response.status === 404) {
                        router.push('/admin/clients');
                        return;
                    }
                    const errorData = await response.data;
                    throw new Error(errorData.error || `Failed to fetch client: ${response.status} ${response.statusText}`);
                }
                const data = await response.data;
                setInitialValues(data as z.infer<typeof clientSchema>); 
            } 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            catch (err: any) {
                setError(err.message as string);
            } finally {
                setLoading(false);
            }
        };
        fetchClient();
    }, [clientId, router, apiBaseURL]);

    const handleUpdateClient = async (values: z.infer<typeof clientSchema>) => {
        const axiosInstance = withAuth();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axiosInstance.put(`${apiBaseURL}/admin/clients/${clientId}`, values);

            if (!response.statusText.includes('OK')) {
                const errorData = await response.data;
                throw new Error(errorData.error || `Client update failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.data;
            setSuccessMessage(data.message); 
        } 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch (err: any) {
            setError(err.message as string);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        router.push('/admin/clients'); 
    };

    if (loading && !initialValues) {
        return <div>Loading client data...</div>; 
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
                    initialValues={initialValues} 
                    onSubmit={handleUpdateClient}
                    submitButtonText="Update Client"
                    cancelButtonText="Cancel"
                    loading={loading}
                    error={error}
                    successMessage={successMessage}
                    onCancel={handleCancelEdit} 
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