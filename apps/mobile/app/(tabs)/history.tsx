import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { Card } from '../../src/components/ui/Card';
import { GuestPrompt } from '../../src/components/ui/GuestPrompt';
import { Screen } from '../../src/components/ui/Screen';
import { colors, radius, spacing } from '../../src/components/ui/theme';
import { useAuth } from '../../src/context/AuthContext';
import { loadConversations, type ConversationRow } from '../../src/lib/conversations';

function formatConversationDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export default function HistoryTabScreen() {
  const { session, isLoading: isAuthLoading } = useAuth();
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (!session) {
      setConversations([]);
      setIsLoading(false);
      setErrorMessage('');
      return;
    }

    let isMounted = true;

    const fetchHistory = async () => {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const items = await loadConversations();

        if (isMounted) {
          setConversations(items);
        }
      } catch {
        if (isMounted) {
          setErrorMessage("We couldn't load your history right now. Please try again.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, session]);

  if (isAuthLoading) {
    return (
      <Screen>
        <Card style={styles.stateCard}>
          <Text style={styles.stateTitle}>Loading history...</Text>
        </Card>
      </Screen>
    );
  }

  if (!session) {
    return (
      <Screen>
        <GuestPrompt
          title="Keep a history when you sign in"
          body="Guests can generate scripts, and saved history unlocks after you create an account."
          primaryLabel="Create Account"
          secondaryLabel="Sign In"
          onPrimaryPress={() => router.push('/auth/sign-up')}
          onSecondaryPress={() => router.push('/auth/sign-in')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>A calm place to revisit scripts you made before.</Text>
        </View>

        {isLoading ? (
          <Card style={styles.stateCard}>
            <Text style={styles.stateTitle}>Loading history...</Text>
          </Card>
        ) : null}

        {!isLoading && Boolean(errorMessage) ? (
          <Card style={styles.stateCard}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Card>
        ) : null}

        {!isLoading && !errorMessage && conversations.length === 0 ? (
          <Card style={styles.stateCard}>
            <Text style={styles.stateTitle}>No history yet.</Text>
            <Text style={styles.stateBody}>Scripts you generate will show up here when you want to look back.</Text>
          </Card>
        ) : null}

        {!isLoading && !errorMessage ? (
          <View style={styles.list}>
            {conversations.map((conversation) => (
              <Card key={conversation.id} style={styles.conversationCard}>
                <View style={styles.conversationMetaRow}>
                  <Text style={styles.conversationDate}>{formatConversationDate(conversation.created_at)}</Text>
                  <Text style={styles.conversationTag}>Hard moment</Text>
                </View>
                <Text style={styles.conversationTitle}>{conversation.title ?? 'Conversation'}</Text>
                <Text style={styles.conversationSummary}>{conversation.summary ?? 'No summary available.'}</Text>
              </Card>
            ))}
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  stateCard: {
    gap: spacing.sm,
  },
  stateTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  stateBody: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
  errorText: {
    color: '#F2B07A',
    fontSize: 13,
    lineHeight: 18,
  },
  list: {
    gap: spacing.sm,
  },
  conversationCard: {
    gap: spacing.sm,
  },
  conversationMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  conversationDate: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  conversationTag: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
    textTransform: 'uppercase',
  },
  conversationTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  conversationSummary: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
  },
});
