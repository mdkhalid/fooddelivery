import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { SupportMessage } from '../../types/support.types';

interface SupportChatProps { messages: SupportMessage[]; onSend: (message: string) => void; }

export const SupportChat: React.FC<SupportChatProps> = ({ messages, onSend }) => {
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);
  const handleSend = () => { if (input.trim()) { onSend(input.trim()); setInput(''); } };
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id} renderItem={({ item }) => (
        <View style={[styles.message, item.sender === 'driver' ? styles.driverMessage : styles.supportMessage]}>
          <Text style={[styles.messageText, item.sender === 'driver' ? styles.driverText : styles.supportText]}>{item.message}</Text>
        </View>
      )} contentContainerStyle={styles.messages} onContentSizeChange={() => flatListRef.current?.scrollToEnd()} />
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} placeholder="Type a message..." value={input} onChangeText={setInput} />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}><Ionicons name="send" size={20} color={colors.white} /></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  messages: { padding: spacing.md, gap: spacing.sm },
  message: { maxWidth: '80%', padding: spacing.md, borderRadius: borderRadius.lg },
  driverMessage: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: spacing.xs },
  supportMessage: { alignSelf: 'flex-start', backgroundColor: colors.gray100, borderBottomLeftRadius: spacing.xs },
  messageText: { ...typography.variants.body2 },
  driverText: { color: colors.white },
  supportText: { color: colors.text },
  inputContainer: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.gray200, gap: spacing.sm },
  input: { flex: 1, borderWidth: 1, borderColor: colors.gray200, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, ...typography.variants.body2 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
