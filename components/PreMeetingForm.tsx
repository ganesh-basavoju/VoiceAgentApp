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

    const generateJobId = () => {
        const id = `JOB-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        setJobId(id);
    };

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
        <ScrollView className="flex-1 bg-background" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}>
            <View className="mb-8">
                <Text className="text-primary text-sm font-bold tracking-[2px] uppercase mb-1">Pre-Check</Text>
                <Text className="text-foreground text-3xl font-light">Session Setup</Text>
            </View>

            {/* Job ID Section */}
            <View className="mb-8">
                <Text className="text-muted-foreground text-xs uppercase tracking-widest mb-3 font-semibold ml-1">Job Identifier</Text>
                <View className="flex-row gap-3">
                    <View className="flex-1 bg-surface rounded-2xl border border-border/50 overflow-hidden">
                        <TextInput
                            value={jobId}
                            onChangeText={setJobId}
                            placeholder="e.g. JOB-2024-001"
                            placeholderTextColor={theme.colors.onSurfaceVariant}
                            className="text-foreground p-4 text-base font-medium"
                        />
                    </View>
                    <TouchableOpacity 
                        onPress={generateJobId}
                        className="bg-secondary/40 px-4 rounded-2xl border border-border/50 items-center justify-center"
                    >
                        <Ionicons name="refresh" size={20} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Meeting Type Chips */}
            <View className="mb-8">
                <Text className="text-muted-foreground text-xs uppercase tracking-widest mb-3 font-semibold ml-1">Session Type</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row -mx-1 px-1">
                    {MEETING_TYPES.map(type => (
                        <TouchableOpacity
                            key={type}
                            onPress={() => setMeetingType(type)}
                            className={`mr-3 px-5 py-3 rounded-full border shadow-sm ${
                                meetingType === type 
                                ? 'bg-primary border-primary' 
                                : 'bg-surface border-border/50'
                            }`}
                        >
                            <Text className={`text-sm font-medium ${
                                meetingType === type 
                                ? 'text-white' 
                                : 'text-muted-foreground'
                            }`}>
                                {type}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Participants */}
            <View className="mb-8">
                 <View className="flex-row justify-between items-center mb-3 px-1">
                    <Text className="text-muted-foreground text-xs uppercase tracking-widest font-semibold">Participants</Text>
                    <TouchableOpacity onPress={addParticipant} className="flex-row items-center bg-secondary/30 px-3 py-1.5 rounded-full border border-border/30">
                        <Ionicons name="add" size={14} color={theme.colors.primary} />
                        <Text className="text-primary text-xs font-bold ml-1">ADD</Text>
                    </TouchableOpacity>
                </View>
                
                <View className="gap-3">
                    {participants.map((p, index) => (
                        <View key={index} className="flex-row gap-3">
                             <View className="flex-[1.2] bg-surface rounded-2xl border border-border/50">
                                <TextInput
                                    value={p.role}
                                    onChangeText={(text) => updateParticipant(index, 'role', text)}
                                    placeholder="Role"
                                    placeholderTextColor={theme.colors.onSurfaceVariant}
                                    className="text-foreground px-4 py-3.5 text-sm font-medium"
                                />
                            </View>
                            <View className="flex-[2] flex-row items-center bg-surface rounded-2xl border border-border/50 pr-2">
                                <TextInput
                                    value={p.name}
                                    onChangeText={(text) => updateParticipant(index, 'name', text)}
                                    placeholder="Name"
                                    placeholderTextColor={theme.colors.onSurfaceVariant}
                                    className="text-foreground px-4 py-3.5 text-sm font-medium flex-1"
                                />
                                 {participants.length > 2 && (
                                    <TouchableOpacity onPress={() => removeParticipant(index)} className="p-2 opacity-70">
                                        <Ionicons name="close-circle-outline" size={20} color={theme.colors.error} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </View>

            {/* Consent */}
            <TouchableOpacity 
                activeOpacity={0.9}
                onPress={() => setConsentGiven(!consentGiven)}
                className={`mb-10 p-5 rounded-3xl border transition-all ${
                    consentGiven 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-surface border-border/50'
                }`}
            >
                <View className="flex-row items-start">
                    <View className={`w-6 h-6 rounded-full border items-center justify-center mr-4 mt-0.5 ${
                        consentGiven 
                        ? 'bg-primary border-primary' 
                        : 'bg-transparent border-muted-foreground'
                    }`}>
                        {consentGiven && <Ionicons name="checkmark" size={14} color="white" />}
                    </View>
                    <View className="flex-1">
                        <Text className={`text-base font-semibold mb-1 ${
                            consentGiven ? 'text-primary' : 'text-foreground'
                        }`}>
                            Recording Consent
                        </Text>
                        <Text className="text-muted-foreground text-sm leading-5">
                            I verify that all present parties have explicitly consented to being recorded for this session.
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => onSubmit({ jobId, meetingType, participants, consentGiven })}
                disabled={!isValid}
                className={`rounded-2xl py-4 items-center shadow-lg ${
                    isValid 
                    ? 'bg-primary shadow-primary/40' 
                    : 'bg-surface border border-border/50 opacity-50 shadow-none'
                }`}
            >
                <Text className={`text-lg font-bold tracking-widest ${
                    isValid ? 'text-white' : 'text-muted-foreground'
                }`}>
                    START SESSION
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

