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

import {clientSchema} from '@/lib/validations/client'; 



interface ClientFormProps {
    initialValues?: z.infer<typeof clientSchema>| null; 
    onSubmit: (values: z.infer<typeof clientSchema>) => Promise<void>; 
    onCancel?: () => void; 
    submitButtonText: string; 
    cancelButtonText?: string; 
    loading: boolean; 
    error: string | null; 
    successMessage: string | null; 
}

const ClientForm: React.FC<ClientFormProps> = ({
    initialValues,
    onSubmit,
    onCancel,
    submitButtonText = "Create Client",
    cancelButtonText = "Cancel",
    loading,
    error,
    successMessage,
}) => {
    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: initialValues || { 
            name: "",
            email: "", 
            phone: "", 
            address: "", 
            is_active: true,
        },
        mode: "onSubmit",  
    });

    const router = useRouter();

    const submitHandler = async (values: z.infer<typeof clientSchema>) => {
        await onSubmit(values); 
        if (!error && successMessage) { 
            router.push('/admin/clients'); 
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
                                <Input type="email" placeholder="Email Address" {...field} value={field.value ?? ''}/>
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
                                <Input type="tel" placeholder="Phone Number" {...field} value={field.value ?? ''}/>
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
                                <Input placeholder="Address" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="is_active"
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

                <div className="flex justify-between">
                    <Button type="submit" disabled={loading}>
                        {submitButtonText}
                        {loading && <span className="ml-2 loading loading-spinner-sm"></span>} 
                    </Button>
                    {onCancel && (
                        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
                            {cancelButtonText}
                        </Button>
                    )}
                    {!onCancel && ( 
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