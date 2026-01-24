import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export interface Participant {
    role: string;
    name: string;
}

export interface PreMeetingData {
    jobId: string;
    meetingType: string;
    participants: Participant[];
    consentGiven: boolean;
}

interface PreMeetingFormProps {
    onSubmit: (data: PreMeetingData) => void;
}

const ROLES = ['PM', 'Homeowner', 'Sub', 'Vendor', 'Internal'];
const MEETING_TYPES = ['Scope', 'Schedule', 'Material', 'Sub Coord', 'Vendor', 'Internal'];

export function PreMeetingForm({ onSubmit }: PreMeetingFormProps) {
    const [jobId, setJobId] = useState('');
    const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
    const [participants, setParticipants] = useState<Participant[]>([{ role: 'PM', name: '' }, { role: 'Homeowner', name: '' }]);
    const [consentGiven, setConsentGiven] = useState(false);

    const addParticipant = () => {
        setParticipants([...participants, { role: 'Sub', name: '' }]);
    };

    const removeParticipant = (index: number) => {
        const newParticipants = [...participants];
        newParticipants.splice(index, 1);
        setParticipants(newParticipants);
    };

    const updateParticipant = (index: number, field: keyof Participant, value: string) => {
        const newParticipants = [...participants];
        newParticipants[index] = { ...newParticipants[index], [field]: value };
        setParticipants(newParticipants);
    };

    const isValid = jobId.length > 0 && participants.every(p => p.name.length > 0) && consentGiven;

    return (
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 }}>
            <View className="mb-8">
                <Text className="text-muted-foreground text-sm font-bold tracking-[2px] uppercase mb-1">Project Details</Text>
                <Text className="text-foreground text-3xl font-light">New Session</Text>
            </View>

            {/* Job ID Section */}
            <View className="mb-6">
                <Text className="text-muted-foreground text-xs uppercase tracking-widest mb-2 font-medium">Job Identifier</Text>
                <View className="bg-input rounded-xl border border-border">
                    <TextInput
                        value={jobId}
                        onChangeText={setJobId}
                        placeholder="e.g. JOB-2024-001"
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        className="text-foreground p-4 text-base"
                    />
                </View>
            </View>

            {/* Meeting Type Chips */}
            <View className="mb-6">
                <Text className="text-muted-foreground text-xs uppercase tracking-widest mb-2 font-medium">Session Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                    {MEETING_TYPES.map(type => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setMeetingType(type)}
                            className={`mr-3 px-4 py-2.5 rounded-full border ${
                                meetingType === type 
                                ? 'bg-primary border-primary' 
                                : 'bg-card border-border'
                            }`}
                        >
                            <Text className={`text-sm ${
                                meetingType === type 
                                ? 'text-primary-foreground font-bold' 
                                : 'text-muted-foreground'
                            }`}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Participants */}
            <View className="mb-6">
                 <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-muted-foreground text-xs uppercase tracking-widest font-medium">Participants</Text>
                    <TouchableOpacity onPress={addParticipant}>
                        <Text className="text-primary text-xs font-bold">+ ADD</Text>
                    </TouchableOpacity>
                </View>
                
                {participants.map((p, index) => (
                    <View key={index} className="flex-row mb-3 gap-3">
                         <View className="flex-1 bg-input rounded-xl border border-border">
                            <TextInput
                                value={p.role}
                                onChangeText={(text) => updateParticipant(index, 'role', text)}
                                placeholder="Role"
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                className="text-foreground px-4 py-3 text-sm"
                            />
                        </View>
                        <View className="flex-[2] flex-row items-center bg-input rounded-xl border border-border pr-2">
                            <TextInput
                                value={p.name}
                                onChangeText={(text) => updateParticipant(index, 'name', text)}
                                placeholder="Name"
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                className="text-foreground px-4 py-3 text-sm flex-1"
                            />
                             {participants.length > 2 && (
                                <TouchableOpacity onPress={() => removeParticipant(index)} className="p-1">
                                    <Ionicons name="close-circle" size={20} color={theme.colors.error} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                ))}
            </View>

            {/* Consent */}
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setConsentGiven(!consentGiven)}
                className={`mb-8 p-4 rounded-xl border flex-row items-center ${
                    consentGiven 
                    ? 'bg-success/10 border-success/50' 
                    : 'bg-card border-border'
                }`}
            >
                <View className={`w-6 h-6 rounded-full border items-center justify-center mr-3 ${
                    consentGiven 
                    ? 'bg-success border-success' 
                    : 'bg-transparent border-muted-foreground'
                }`}>
                    {consentGiven && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text className={`flex-1 text-sm font-medium ${
                    consentGiven ? 'text-emerald-800' : 'text-muted-foreground'
                }`}>
                    I confirm all parties have explicitly consented to being recorded for this session.
                </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => onSubmit({ jobId, meetingType, participants, consentGiven })}
                disabled={!isValid}
                className={`rounded-2xl py-4 items-center mb-10 shadow-sm ${
                    isValid 
                    ? 'bg-primary shadow-md shadow-primary/30' 
                    : 'bg-muted opacity-50 shadow-none'
                }`}
            >
                <Text className={`text-lg font-bold tracking-widest ${
                    isValid ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                    INITIATE RECORDING
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

