import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

/* ── Brand colors & Creative accents ── */
const ACCENT = "#0D9488"; // Teal
const DARK = "#0F172A"; // Slate 900
const MUTED = "#64748B"; // Slate 500
const LIGHT = "#F8FAFC"; // Slate 50

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    lineHeight: 1.5,
    flexDirection: "row",
  },
  leftColumn: {
    width: "35%",
    backgroundColor: LIGHT,
    padding: 30,
    height: "100%",
    borderRightWidth: 1,
    borderRightColor: "#E2E8F0",
  },
  rightColumn: {
    width: "65%",
    padding: 30,
    height: "100%",
  },
  /* ── Left Column Elements ── */
  nameContainer: {
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: ACCENT,
    paddingLeft: 10,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: DARK,
    letterSpacing: 1,
    lineHeight: 1.1,
    textTransform: "uppercase",
  },
  titleBadge: {
    fontSize: 10,
    color: MUTED,
    marginTop: 4,
    fontFamily: "Helvetica-Oblique",
  },
  contactSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  contactItem: {
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 8,
    color: MUTED,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  contactValue: {
    fontSize: 9,
    color: DARK,
  },
  skillsSection: {
    marginBottom: 30,
  },
  leftSectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: DARK,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  skillText: {
    fontSize: 9,
    color: DARK,
    marginBottom: 4,
    padding: 4,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 2,
  },
  /* ── Right Column Elements ── */
  summary: {
    fontSize: 10,
    color: MUTED,
    marginBottom: 24,
    lineHeight: 1.6,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },
  entryBlock: {
    marginBottom: 16,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: DARK,
  },
  entrySubtitle: {
    fontSize: 10,
    color: MUTED,
    fontFamily: "Helvetica-Oblique",
  },
  entryDate: {
    fontSize: 9,
    color: ACCENT,
    fontFamily: "Helvetica-Bold",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
    color: MUTED,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: DARK,
  },
});

interface Props {
  data: ResumeData;
}

export function CreativeMinimalTemplate({ data }: Props) {
  const { personalInfo, summary, workExperience, education, skills, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* LEFT COLUMN */}
        <View style={styles.leftColumn}>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>
              {personalInfo.name ? personalInfo.name.split(" ").join("\n") : "Your\nName"}
            </Text>
            {data.title && data.title !== "Untitled Resume" && (
              <Text style={styles.titleBadge}>{data.title}</Text>
            )}
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.leftSectionTitle}>Contact</Text>
            {personalInfo.email && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{personalInfo.email}</Text>
              </View>
            )}
            {personalInfo.phone && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>{personalInfo.phone}</Text>
              </View>
            )}
            {personalInfo.location && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactValue}>{personalInfo.location}</Text>
              </View>
            )}
            {personalInfo.linkedin && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>LinkedIn</Text>
                <Text style={styles.contactValue}>{personalInfo.linkedin}</Text>
              </View>
            )}
            {personalInfo.website && (
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Site</Text>
                <Text style={styles.contactValue}>{personalInfo.website}</Text>
              </View>
            )}
          </View>

          {skills.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.leftSectionTitle}>Expertise</Text>
              {skills.map((skill, i) => (
                <Text key={i} style={styles.skillText}>{skill}</Text>
              ))}
            </View>
          )}

          {certifications.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.leftSectionTitle}>Awards</Text>
              {certifications.map((cert, i) => (
                <View key={i} style={{ marginBottom: 6 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", fontSize: 9, color: DARK }}>{cert.name}</Text>
                  <Text style={{ fontSize: 8, color: MUTED }}>{cert.issuer} {cert.year}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* RIGHT COLUMN */}
        <View style={styles.rightColumn}>
          {summary && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Profile</Text>
              <Text style={styles.summary}>{summary}</Text>
            </View>
          )}

          {workExperience.length > 0 && (
            <View style={{ marginBottom: 10 }}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {workExperience.map((job, i) => (
                <View key={i} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.entryTitle}>{job.title || "Job Title"}</Text>
                      <Text style={styles.entrySubtitle}>{job.company || "Company"}</Text>
                    </View>
                    <Text style={styles.entryDate}>
                      {job.startDate || "Start"} — {job.current ? "Present" : job.endDate || "End"}
                    </Text>
                  </View>
                  {job.bullets
                    .filter((b) => b.trim())
                    .map((bullet, bIdx) => (
                      <View key={bIdx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>-</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, i) => (
                <View key={i} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.entryTitle}>
                        {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                      </Text>
                      <Text style={styles.entrySubtitle}>{edu.school}</Text>
                      {edu.grade && <Text style={{ fontSize: 9, color: DARK, marginTop: 2 }}>{edu.grade}</Text>}
                    </View>
                    <Text style={styles.entryDate}>{edu.year}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
