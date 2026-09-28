import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { theme } from '@/constants/theme';

export default function TourScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.kicker}>Later session</Text>
      <Text style={styles.title}>Guided campus tours</Text>
      <Text style={styles.lede}>
        A guided walk around Central University at Mile 91 will be added in a later session. This
        tab introduces that feature. It does not start a tour today.
      </Text>

      <View style={styles.panel}>
        <Text style={styles.panelKicker}>Available now</Text>
        <Step
          index="01"
          title="Look around the map"
          body="Pins show the shared campus places. Tap one to read what that place offers."
        />
        <View style={styles.rule} />
        <Step
          index="02"
          title="Search the directory"
          body="Use Places to find a name or narrow the list to one category."
        />
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelKicker}>Planned next</Text>
        <Text style={styles.body}>
          Some records already store a tour order so a future walk can visit them in sequence.
          Walking directions and your current position are planned for Day Two.
        </Text>
      </View>
    </ScrollView>
  );
}

function Step({ index, title, body }: { index: string; title: string; body: string }) {
  return (
    <View style={styles.step}>
      <Text style={styles.index}>{index}</Text>
      <View style={styles.stepCopy}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.body}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 16,
    backgroundColor: theme.background,
  },
  kicker: {
    color: theme.accent,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.text,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  lede: {
    color: theme.text,
    fontSize: 16,
    lineHeight: 24,
  },
  panel: {
    backgroundColor: theme.card,
    borderRadius: 24,
    padding: 18,
    gap: 16,
  },
  panelKicker: {
    color: theme.muted,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  step: {
    flexDirection: 'row',
    gap: 14,
  },
  index: {
    width: 36,
    color: theme.accent,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  stepCopy: {
    flex: 1,
    gap: 4,
  },
  stepTitle: {
    color: theme.text,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
  },
  body: {
    color: theme.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  rule: {
    height: 1,
    backgroundColor: theme.border,
  },
});
