import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, Colors } from '../constants/theme';
import { jobsService } from '../services/jobs';

interface AskJobModalProps {
    visible: boolean;
    onClose: () => void;
    jobId: string;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: number;
}

export function AskJobModal({ visible, onClose, jobId }: AskJobModalProps) {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (visible) {
            // Reset or load history if persistent
             if (messages.length === 0) {
                 setMessages([{
                     id: 'welcome',
                     text: `Hello! I'm your Job Assistant. I have access to all your meeting notes for Job ${jobId}. Ask me anything!`,
                     sender: 'assistant',
                     timestamp: Date.now()
                 }]);
             }
        }
    }, [visible]);

    const handleSend = async () => {
        if (!question.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: question,
            sender: 'user',
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setQuestion('');
        setLoading(true);
        Keyboard.dismiss();

        try {
            const answer = await jobsService.askJob(jobId, userMsg.text);
            
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: answer,
                sender: 'assistant',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I couldn't get an answer right now. Please try again.",
                sender: 'assistant',
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-black/50 justify-end"
            >
                <View className="bg-background h-[85%] rounded-t-3xl border-t border-border shadow-2xl overflow-hidden">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-4 border-b border-border bg-card">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                                <Ionicons name="sparkles" size={20} color="white" />
                            </View>
                            <View>
                                <Text className="text-lg font-bold text-foreground">Ask the Job</Text>
                                <Text className="text-xs text-muted-foreground">Smart Project Memory</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} className="p-2 bg-secondary rounded-full">
                            <Ionicons name="close" size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Chat Area */}
                    <ScrollView 
                        ref={scrollViewRef}
                        className="flex-1 px-4 py-4"
                        contentContainerStyle={{ paddingBottom: 20 }}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map((msg) => (
                            <View 
                                key={msg.id} 
                                className={`mb-4 max-w-[85%] ${
                                    msg.sender === 'user' 
                                    ? 'self-end' 
                                    : 'self-start'
                                }`}
                            >
                                <View className={`p-4 rounded-2xl ${
                                    msg.sender === 'user'
                                    ? 'bg-primary rounded-tr-none'
                                    : 'bg-card border border-border rounded-tl-none'
                                }`}>
                                    <Text className={`text-base leading-6 ${
                                        msg.sender === 'user' ? 'text-primary-foreground' : 'text-foreground'
                                    }`}>
                                        {msg.text}
                                    </Text>
                                </View>
                                <Text className={`text-[10px] text-muted-foreground mt-1 ${
                                    msg.sender === 'user' ? 'text-right' : 'text-left'
                                }`}>
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        ))}
                        {loading && (
                            <View className="self-start bg-card border border-border p-4 rounded-2xl rounded-tl-none mb-4">
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            </View>
                        )}
                    </ScrollView>

                    {/* Input Area */}
                    <View className="p-4 border-t border-border bg-card pb-8">
                        <View className="flex-row items-center gap-3">
                            <TextInput
                                className="flex-1 bg-secondary text-foreground p-4 rounded-xl text-base max-h-24"
                                placeholder="Ask about materials, dates, changes..."
                                placeholderTextColor={theme.colors.onSurfaceVariant}
                                value={question}
                                onChangeText={setQuestion}
                                multiline
                                onSubmitEditing={handleSend}
                            />
                            <TouchableOpacity 
                                onPress={handleSend}
                                disabled={loading || !question.trim()}
                                className={`w-12 h-12 rounded-full items-center justify-center ${
                                    loading || !question.trim() ? 'bg-secondary' : 'bg-primary'
                                }`}
                            >
                                <Ionicons 
                                    name="send" 
                                    size={20} 
                                    color={loading || !question.trim() ? theme.colors.onSurfaceVariant : 'white'} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
