"use client";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFormStore } from "@/store/useStore"; // Import the Zustand store
import React from "react";
import { toast } from "sonner";

export default function Settings() {
    const { watchRegion, setWatchRegion, formHydrated } = useFormStore(); // Access Zustand store

    const handleRegionChange = (region: string) => {
        setWatchRegion(region); // Update the watchRegion in the store
        toast(`Updated watch region to ${region}`);
    };

    function returnSettingsOnHydrate() {
        if (formHydrated) {
            return (
                <section className="max-w-2xl p-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="region">Watch region</Label>
                        <Select
                            defaultValue={watchRegion} // Set the current region as default
                            onValueChange={handleRegionChange} // Handle region change
                        >
                            <SelectTrigger id="region" className="w-[180px]">
                                <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="US">United States</SelectItem>
                                <SelectItem value="CA">Canada</SelectItem>
                                <SelectItem value="GB">United Kingdom</SelectItem>
                                <SelectItem value="AU">Australia</SelectItem>
                                <SelectItem value="DE">Germany</SelectItem>
                                <SelectItem value="FR">France</SelectItem>
                                <SelectItem value="IN">India</SelectItem>
                                {/* Add more regions as needed */}
                            </SelectContent>
                        </Select>
                    </div>
                </section>
            );
        }
    }

    return <>{returnSettingsOnHydrate()}</>;
}
