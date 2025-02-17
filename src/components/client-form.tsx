'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button,buttonVariants } from "@/components/ui/button";

import { clientSchema } from '@/lib/validations/client'; // Import Zod schema

interface Client {
    name: string;
    passcode: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    isActive: boolean;
    isAdmin: boolean;
}

interface ClientFormProps {
    initialValues?: Client | null; // Optional initial values for edit mode
    onSubmit: (values: z.infer<typeof clientSchema>) => Promise<void>; // Function to handle form submission
    onCancel?: () => void; // Optional cancel handler
    submitButtonText: string; // Text for the submit button
    cancelButtonText?: string; // Text for the cancel button (optional)
    loading: boolean; // Loading state
    error: string | null; // Error message
    successMessage: string | null; // Success message
}

const ClientForm: React.FC<ClientFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    submitButtonText,
    cancelButtonText = "Cancel", // Default cancel button text
    loading,
    error,
    successMessage,
}) => {
    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: initialValues || { 
            name: "",
            passcode: "",
            email: "", 
            phone: "", 
            address: "", 
            isActive: true,
            isAdmin: false,
        },
        mode: "onSubmit", // Validate on submit
    });

    const router = useRouter();

    const submitHandler = async (values: z.infer<typeof clientSchema>) => {
        console.log("submitHandler function is being called!"); // <-- ADD THIS LINE
        await onSubmit(values); // Call the onSubmit prop function
        if (!error && successMessage) { // If submission was successful and no error
            router.push('/admin/clients'); // Redirect to client list
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{successMessage}</span>
                    </div>
                )}

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Client Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Email Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone (Optional)</FormLabel>
                            <FormControl>
                                <Input type="tel" placeholder="Phone Number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Address (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Address" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 font-medium shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            <FormLabel className="text-left">Is Active</FormLabel>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isAdmin"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-md border px-3 py-2 font-medium shadow-sm transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                            <FormLabel className="text-left">Is Admin</FormLabel>
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <div className="flex justify-between">
                    <Button type="submit" disabled={loading}>
                        {submitButtonText}
                        {loading && <span className="ml-2 loading loading-spinner-sm"></span>} {/* Optional loading spinner */}
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                            {cancelButtonText}
                        </Button>
                    )}
                    {!onCancel && ( // If no onCancel prop, render a "Cancel" Link to client list
                        <Link href="/admin/clients" className={buttonVariants({ variant: "secondary" })} >
                            {cancelButtonText}
                        </Link>
                    )}
                </div>
            </form>
        </Form>
    );
};

export default ClientForm;