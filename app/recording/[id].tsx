import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, TextInput, Alert, ActivityIndicator, Modal, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RecordingMetadata, storageService } from '../../services/storage';
import { theme, Colors } from '../../constants/theme';
import { StatusBar } from 'expo-status-bar';

export default function RecordingDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [recording, setRecording] = useState<RecordingMetadata | null>(null);
    const [activeTab, setActiveTab] = useState<'summary' | 'transcript' | 'actions'>('summary');
    
    // Edit Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [editedAnalysis, setEditedAnalysis] = useState<RecordingMetadata['analysis'] | null>(null);
    const [saving, setSaving] = useState(false);
    
    // Menu State
    const [menuVisible, setMenuVisible] = useState(false);
    
    // History State
    const [historyVisible, setHistoryVisible] = useState(false);

    useEffect(() => {
        loadRecording();
    }, [id]);

    const loadRecording = async () => {
        const all = await storageService.getAllMetadata();
        const found = all.find(r => r.id === id);
        if (found) {
            setRecording(found);
            // Initialize edited analysis with deep copy or fallback
            setEditedAnalysis(JSON.parse(JSON.stringify(found.analysis || {})));
        }
    };

    if (!recording) {
        return (
            <SafeAreaView className="flex-1 bg-background justify-center items-center">
                <Text className="text-muted-foreground">Loading...</Text>
            </SafeAreaView>
        );
    }

    const { analysis, approval } = recording;
    // Use editedAnalysis when editing, otherwise fall back to saved analysis
    const displayAnalysis = isEditing ? editedAnalysis : analysis;

    const handleShare = async () => {
         if (!analysis) return;
         try {
             const message = `
Meeting Summary:
${analysis.editedSummary.text}

Action Items (PM):
${analysis.actionItems?.pm?.map(i => `- ${i}`).join('\n') || 'None'}

Action Items (Other Parties):
${analysis.actionItems?.otherParties?.map(i => `- ${i}`).join('\n') || 'None'}
             `;
             await Share.share({ message });
         } catch (error) {
             console.error(error);
         }
    };

    const handleSave = async (approve = false) => {
        if (!editedAnalysis || !recording) return;
        
        setSaving(true);
        try {
            // Increment Version
            const currentVersion = editedAnalysis.editedSummary.version || 1;
            const newAnalysis = {
                ...editedAnalysis,
                editedSummary: {
                    ...editedAnalysis.editedSummary,
                    version: currentVersion + 1
                }
            };

            // Create history entry
            const historyEntry = {
                timestamp: Date.now(),
                version: currentVersion,
                summary: recording.analysis?.editedSummary?.text || '',
                editor: 'User', // Could be dynamic if we had user info
            };
            
            const newHistory = [...(recording.history || []), historyEntry];

            const updates: Partial<RecordingMetadata> = {
                analysis: newAnalysis,
                history: newHistory
            };

            if (approve) {
                updates.approval = {
                    status: 'approved',
                    timestamp: Date.now(),
                    approver: 'CurrentUser' // Replace with actual user info if available
                };
            }

            await storageService.updateRecording(recording.id, updates);
            await loadRecording(); // Reload to get fresh state
            setIsEditing(false);
            if (approve) Alert.alert("Success", "Recording approved and saved.");
            else Alert.alert("Success", "Changes saved.");
        } catch (error) {
            Alert.alert("Error", "Failed to save changes.");
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            // Cancel editing - reset state
            setEditedAnalysis(JSON.parse(JSON.stringify(recording.analysis || {})));
            setIsEditing(false);
        } else {
            // Start editing
            setEditedAnalysis(JSON.parse(JSON.stringify(recording.analysis || {})));
            setIsEditing(true);
        }
    };

    // Helper to update Summary
    const updateSummary = (text: string) => {
        if (!editedAnalysis) return;
        setEditedAnalysis({
            ...editedAnalysis,
            editedSummary: {
                ...editedAnalysis.editedSummary,
                text
            }
        });
    };

    // Helper to update Action Item
    const updateActionItem = (role: 'pm' | 'otherParties', index: number, text: string) => {
        if (!editedAnalysis?.actionItems) return;
        const newItems = [...(editedAnalysis.actionItems[role] || [])];
        newItems[index] = text;
        setEditedAnalysis({
            ...editedAnalysis,
            actionItems: {
                ...editedAnalysis.actionItems,
                [role]: newItems
            }
        });
    };

    // Helper to remove Action Item
    const removeActionItem = (role: 'pm' | 'otherParties', index: number) => {
        if (!editedAnalysis?.actionItems) return;
        const newItems = [...(editedAnalysis.actionItems[role] || [])];
        newItems.splice(index, 1);
        setEditedAnalysis({
            ...editedAnalysis,
            actionItems: {
                ...editedAnalysis.actionItems,
                [role]: newItems
            }
        });
    };

    // Helper to add Action Item
    const addActionItem = (role: 'pm' | 'otherParties') => {
        if (!editedAnalysis?.actionItems) return;
        const newItems = [...(editedAnalysis.actionItems[role] || []), ""];
        setEditedAnalysis({
            ...editedAnalysis,
            actionItems: {
                ...editedAnalysis.actionItems,
                [role]: newItems
            }
        });
    };

     // Helper to update Transcript
    const updateTranscript = (index: number, field: 'text' | 'speakerName', value: string) => {
        if (!editedAnalysis) return;
        // Ensure editedTranscript exists, init from raw if needed
        const currentTranscript = editedAnalysis.editedTranscript || [...editedAnalysis.rawTranscript];
        const newTranscript = [...currentTranscript];
        newTranscript[index] = { ...newTranscript[index], [field]: value };
        
        setEditedAnalysis({
            ...editedAnalysis,
            editedTranscript: newTranscript
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <StatusBar style="light" />
            
            {/* Header */}
             <View className="flex-row items-center justify-between px-6 py-4 border-b border-border bg-background z-10">
                <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 rounded-full active:bg-secondary">
                    <Ionicons name="arrow-back" size={24} color={theme.colors.onSurface} />
                </TouchableOpacity>
                <View className="items-center">
                    <Text className="text-[10px] font-bold uppercase tracking-[2px] text-muted-foreground">Field Notes</Text>
                    <Text className="text-lg font-bold text-foreground">{recording.jobId}</Text>
                    {approval?.status === 'approved' && <Text className="text-[10px] text-success font-bold uppercase mt-0.5">Approved</Text>}
                </View>
                <TouchableOpacity onPress={() => setMenuVisible(true)} className="p-2 -mr-2 rounded-full active:bg-secondary">
                    <Ionicons name="ellipsis-vertical" size={24} color={Colors.accent} />
                </TouchableOpacity>
             </View>

             {!analysis ? (
                 <View className="flex-1 justify-center items-center p-8">
                     <View className="w-20 h-20 rounded-full bg-secondary items-center justify-center mb-6 animate-pulse">
                        <Ionicons name="cloud-upload-outline" size={40} color={Colors.accent} />
                     </View>
                     <Text className="text-xl font-bold text-foreground mb-2">Processing audio...</Text>
                     <Text className="text-muted-foreground text-center">The transcript and summary will appear here once the upload completes.</Text>
                 </View>
             ) : (
                 <>
                    {/* Tabs */}
                    <View className="flex-row px-4 py-4 gap-2">
                        {(['summary', 'actions', 'transcript'] as const).map(tab => (
                            <TouchableOpacity 
                                key={tab} 
                                onPress={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 rounded-xl border items-center justify-center ${
                                    activeTab === tab 
                                    ? 'bg-primary border-primary' 
                                    : 'bg-card border-border'
                                }`}
                            >
                                <Text className={`text-sm font-semibold capitalize ${
                                    activeTab === tab 
                                    ? 'text-white' 
                                    : 'text-muted-foreground'
                                }`}>
                                    {tab}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
                        {activeTab === 'summary' && (
                            <View className="mt-2">
                                <View className="flex-row items-center justify-between mb-3">
                                    <Text className="text-primary text-xs font-bold uppercase tracking-widest">Executive Summary</Text>
                                    <View className="bg-secondary px-2 py-1 rounded-md border border-border">
                                        <Text className="text-xs text-muted-foreground font-mono">
                                            v{displayAnalysis?.editedSummary?.version || 1}
                                            {isEditing ? ' (Editing)' : ''}
                                        </Text>
                                    </View>
                                </View>
                                <View className="bg-card p-5 rounded-2xl border border-border shadow-sm">
                                    {isEditing ? (
                                        <TextInput 
                                            multiline 
                                            value={displayAnalysis?.editedSummary.text}
                                            onChangeText={updateSummary}
                                            className="text-foreground text-base leading-7 min-h-[100px]"
                                            textAlignVertical="top"
                                        />
                                    ) : (
                                        <Text className="text-foreground text-base leading-7">{displayAnalysis?.editedSummary.text}</Text>
                                    )}
                                </View>
                            </View>
                        )}

                        {activeTab === 'actions' && (
                            <View className="mt-2">
                                {/* PM Items */}
                                <View className="mb-6">
                                    <View className="flex-row items-center justify-between mb-3">
                                        <View className="flex-row items-center">
                                            <View className="w-1 h-4 bg-primary rounded-full mr-2" />
                                            <Text className="text-foreground text-base font-bold">Project Manager (PM)</Text>
                                        </View>
                                        {isEditing && (
                                            <TouchableOpacity onPress={() => addActionItem('pm')} className="bg-secondary p-1 rounded-full">
                                                <Ionicons name="add" size={16} color={theme.colors.primary} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    
                                    {displayAnalysis?.actionItems?.pm?.length ? (
                                        displayAnalysis.actionItems.pm.map((item, i) => (
                                            <View key={i} className="bg-card p-4 rounded-xl border border-border mb-2 flex-row gap-3 items-start">
                                                <Ionicons name="square-outline" size={20} color={Colors.accent} style={{ marginTop: 2 }} />
                                                {isEditing ? (
                                                    <View className="flex-1 flex-row gap-2">
                                                        <TextInput 
                                                            value={typeof item === 'object' ? item.title : String(item)}
                                                            onChangeText={(text) => updateActionItem('pm', i, text)}
                                                            className="flex-1 text-foreground text-sm leading-5 p-0"
                                                            multiline
                                                        />
                                                        <TouchableOpacity onPress={() => removeActionItem('pm', i)}>
                                                             <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <View className="flex-1">
                                                        <Text className="text-foreground text-sm leading-5 font-semibold">
                                                            {typeof item === 'object' ? item.title : String(item)}
                                                        </Text>
                                                        {typeof item === 'object' && (
                                                            <View className="flex-row mt-1 gap-2">
                                                                {item.ownerName && <Text className="text-xs text-muted-foreground">Owner: {item.ownerName}</Text>}
                                                                {item.dueDate && <Text className="text-xs text-muted-foreground">Due: {item.dueDate}</Text>}
                                                            </View>
                                                        )}
                                                    </View>
                                                )}
                                            </View>
                                        ))
                                    ) : (
                                        <Text className="text-muted-foreground italic ml-4">No action items for PM.</Text>
                                    )}
                                </View>

                 {/* Other Parties Items */}
                                 <View>
                                    <View className="flex-row items-center justify-between mb-3">
                                        <View className="flex-row items-center">
                                            <View className="w-1 h-4 bg-accent rounded-full mr-2" />
                                            <Text className="text-foreground text-base font-bold">Other Parties</Text>
                                        </View>
                                        {isEditing && (
                                            <TouchableOpacity onPress={() => addActionItem('otherParties')} className="bg-secondary p-1 rounded-full">
                                                <Ionicons name="add" size={16} color={theme.colors.primary} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    
                                    {displayAnalysis?.actionItems?.otherParties?.length ? (
                                        displayAnalysis.actionItems.otherParties.map((item, i) => (
                                            <View key={i} className="bg-card p-4 rounded-xl border border-border mb-2 flex-row gap-3 items-start">
                                                <Ionicons name="people-outline" size={20} color={Colors.primaryLight} style={{ marginTop: 2 }} />
                                                 {isEditing ? (
                                                    <View className="flex-1 flex-row gap-2">
                                                        <TextInput 
                                                            value={typeof item === 'object' ? item.title : String(item)}
                                                            onChangeText={(text) => updateActionItem('otherParties', i, text)}
                                                            className="flex-1 text-foreground text-sm leading-5 p-0"
                                                            multiline
                                                        />
                                                        <TouchableOpacity onPress={() => removeActionItem('otherParties', i)}>
                                                             <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
                                                        </TouchableOpacity>
                                                    </View>
                                                ) : (
                                                    <View className="flex-1">
                                                        <Text className="text-foreground text-sm leading-5 font-semibold">
                                                            {typeof item === 'object' ? item.title : String(item)}
                                                        </Text>
                                                        {typeof item === 'object' && (
                                                            <View className="flex-row mt-1 gap-2">
                                                                {item.ownerName && <Text className="text-xs text-muted-foreground">Owner: {item.ownerName}</Text>}
                                                                {item.dueDate && <Text className="text-xs text-muted-foreground">Due: {item.dueDate}</Text>}
                                                            </View>
                                                        )}
                                                    </View>
                                                )}
                                            </View>
                                        ))
                                    ) : (
                                        <Text className="text-muted-foreground italic ml-4">No action items for others.</Text>
                                    )}
                                </View>
                            </View>
                        )}

                        {activeTab === 'transcript' && (
                            <View className="mt-2 text-foreground">
                                {(displayAnalysis?.editedTranscript || displayAnalysis?.rawTranscript)?.map((entry, i) => (
                                    <View key={i} className="flex-row mb-6">
                                        <Text className="text-muted-foreground text-xs w-10 mt-1 font-variant-tabular">{entry.time}</Text>
                                        <View className="flex-1">
                                            {isEditing ? (
                                                <View className="bg-secondary/30 p-2 rounded-lg border border-border">
                                                    <TextInput 
                                                        value={entry.speakerName}
                                                        onChangeText={(text) => updateTranscript(i, 'speakerName', text)}
                                                        className="text-primary text-xs font-bold mb-1"
                                                        placeholder="Speaker Name"
                                                    />
                                                    <TextInput 
                                                        value={entry.text}
                                                        onChangeText={(text) => updateTranscript(i, 'text', text)}
                                                        className="text-foreground text-base leading-6"
                                                        multiline
                                                    />
                                                </View>
                                            ) : (
                                                <>
                                                    <Text className="text-primary text-xs font-bold mb-1">
                                                        {entry.speakerName || 'Unknown Speaker'}
                                                    </Text>
                                                    <Text className="text-foreground text-base leading-6">{entry.text}</Text>
                                                </>
                                            )}
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    {/* Action Buttons Footer */}
                    {isEditing && (
                        <View className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border flex-row gap-3 shadow-lg">
                            <TouchableOpacity 
                                onPress={() => handleSave(false)} 
                                disabled={saving}
                                className="flex-1 bg-secondary py-3 rounded-xl items-center border border-border"
                            >
                                <Text className="text-primary font-bold">Save Draft</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                onPress={() => handleSave(true)}
                                disabled={saving}
                                className="flex-1 bg-primary py-3 rounded-xl items-center shadow-md"
                            >
                                {saving ? (
                                    <ActivityIndicator color={theme.colors.onPrimary} />
                                ) : (
                                    <Text className="text-primary-foreground font-bold">Approve Data</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                 </>
             )}
            {/* Options Menu Modal */}
            <Modal
                transparent={true}
                visible={menuVisible}
                onRequestClose={() => setMenuVisible(false)}
                animationType="fade"
            >
                <TouchableOpacity 
                    className="flex-1" // Transparent backdrop
                    activeOpacity={1} 
                    onPress={() => setMenuVisible(false)}
                >
                    <View className="flex-1 relative">
                         {/* Positioned Menu */}
                        <View className="absolute top-14 right-6 w-56 bg-card rounded-xl border border-border shadow-xl overflow-hidden z-50">
                                <TouchableOpacity 
                                    onPress={() => { setMenuVisible(false); handleShare(); }}
                                    className="flex-row items-center p-3 border-b border-border/50 active:bg-secondary"
                                >
                                    <Ionicons name="share-social-outline" size={20} color={Colors.text} style={{ marginRight: 10 }} />
                                    <Text className="text-foreground text-sm font-medium">Share</Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    onPress={() => { setMenuVisible(false); toggleEdit(); }}
                                    className="flex-row items-center p-3 border-b border-border/50 active:bg-secondary"
                                >
                                    <Ionicons name="create-outline" size={20} color={Colors.text} style={{ marginRight: 10 }} />
                                    <Text className="text-foreground text-sm font-medium">{isEditing ? 'Cancel Edit' : 'Edit Notes'}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { setMenuVisible(false); Alert.alert("Email", "Opening mail composer..."); }}
                                    className="flex-row items-center p-3 border-b border-border/50 active:bg-secondary"
                                >
                                    <Ionicons name="mail-outline" size={20} color={Colors.text} style={{ marginRight: 10 }} />
                                    <Text className="text-foreground text-sm font-medium">Send Email</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { setMenuVisible(false); Alert.alert("Save", "Saving to Drive..."); }}
                                    className="flex-row items-center p-3 border-b border-border/50 active:bg-secondary"
                                >
                                    <Ionicons name="cloud-download-outline" size={20} color={Colors.text} style={{ marginRight: 10 }} />
                                    <Text className="text-foreground text-sm font-medium">Save to Drive</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={() => { setMenuVisible(false); setHistoryVisible(true); }}
                                    className="flex-row items-center p-3 active:bg-secondary"
                                >
                                    <Ionicons name="time-outline" size={20} color={Colors.text} style={{ marginRight: 10 }} />
                                    <Text className="text-foreground text-sm font-medium">View History</Text>
                                </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* History Modal */}
            <Modal
                transparent={true}
                visible={historyVisible}
                onRequestClose={() => setHistoryVisible(false)}
                animationType="slide"
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-background rounded-t-3xl h-[70%] border-t border-border shadow-2xl">
                        <View className="flex-row items-center justify-between p-6 border-b border-border">
                             <Text className="text-xl font-bold text-foreground">Version History</Text>
                             <TouchableOpacity onPress={() => setHistoryVisible(false)} className="p-2 bg-secondary rounded-full">
                                 <Ionicons name="close" size={24} color={Colors.text} />
                             </TouchableOpacity>
                        </View>
                        
                        <ScrollView className="flex-1 p-6">
                            {(recording?.history && recording.history.length > 0) ? (
                                recording.history.slice().reverse().map((item, index) => (
                                    <View key={index} className="mb-6 border-l-2 border-border pl-4 ml-2">
                                        <View className="flex-row items-center mb-2 -ml-[25px]">
                                             <View className="w-4 h-4 rounded-full bg-primary border-2 border-background z-10" />
                                             <Text className="text-xs text-muted-foreground ml-2 font-mono">
                                                 {new Date(item.timestamp).toLocaleString()}
                                             </Text>
                                        </View>
                                        
                                        <View className="bg-card p-4 rounded-xl border border-border">
                                            <View className="flex-row justify-between mb-2">
                                                <Text className="text-primary font-bold text-xs uppercase tracking-wider">Version {item.version}</Text>
                                                <Text className="text-muted-foreground text-xs">By {item.editor}</Text>
                                            </View>
                                            <Text className="text-foreground text-sm leading-6" numberOfLines={4}>
                                                {item.summary}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View className="items-center justify-center py-10">
                                    <Text className="text-muted-foreground">No history available yet.</Text>
                                    <Text className="text-muted-foreground text-xs mt-2">Edits will appear here.</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

