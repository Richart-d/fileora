import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

/* ── Brand colours ── */
const TEAL = "#0D9488";
const NAVY = "#1E3A5F";
const DARK = "#1E293B";
const MUTED = "#64748B";
const LIGHT_BG = "#F1F5F9";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    lineHeight: 1.4,
  },

  /* ── Header band ── */
  headerBand: {
    backgroundColor: NAVY,
    paddingVertical: 24,
    paddingHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
    paddingRight: 20,
  },
  headerRight: {
    width: 180,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255,255,255,0.25)",
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 24,
    color: "#FFFFFF",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  titleBadge: {
    fontSize: 11,
    color: TEAL,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  summaryHeader: {
    fontSize: 9.5,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.5,
  },
  contactItem: {
    fontSize: 9,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4,
  },
  contactLabel: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    color: TEAL,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 1,
  },

  /* ── Body ── */
  body: {
    paddingHorizontal: 40,
    paddingTop: 20,
    paddingBottom: 36,
  },

  /* ── Section ── */
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 12,
    color: NAVY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 2,
    borderBottomColor: TEAL,
  },

  /* ── Experience ── */
  entryBlock: {
    marginBottom: 10,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10.5,
    color: DARK,
  },
  entryCompany: {
    fontSize: 10,
    color: TEAL,
    fontFamily: "Helvetica-Bold",
  },
  entryDate: {
    fontSize: 9,
    color: MUTED,
    fontFamily: "Helvetica-Oblique",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 12,
    fontSize: 10,
    color: TEAL,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.5,
  },

  /* ── Education ── */
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  /* ── Skills ── */
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillChip: {
    backgroundColor: LIGHT_BG,
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 8,
    fontSize: 9,
    color: NAVY,
    fontFamily: "Helvetica-Bold",
  },

  /* ── Certs ── */
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  certName: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  certMeta: {
    fontSize: 9,
    color: MUTED,
  },
});

interface Props {
  data: ResumeData;
}

export function ModernProTemplate({ data }: Props) {
  const { personalInfo, summary, workExperience, education, skills, certifications } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER BAND (two-column) ── */}
        <View style={styles.headerBand}>
          {/* Left: name + summary */}
          <View style={styles.headerLeft}>
            <Text style={styles.name}>
              {personalInfo.name || "Your Name"}
            </Text>
            {data.title && data.title !== "Untitled Resume" && (
              <Text style={styles.titleBadge}>{data.title}</Text>
            )}
            {summary ? (
              <Text style={styles.summaryHeader}>{summary}</Text>
            ) : null}
          </View>

          {/* Right: contact details */}
          <View style={styles.headerRight}>
            {personalInfo.email ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactItem}>{personalInfo.email}</Text>
              </View>
            ) : null}
            {personalInfo.phone ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactItem}>{personalInfo.phone}</Text>
              </View>
            ) : null}
            {personalInfo.location ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.contactLabel}>Location</Text>
                <Text style={styles.contactItem}>{personalInfo.location}</Text>
              </View>
            ) : null}
            {personalInfo.linkedin ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.contactLabel}>LinkedIn</Text>
                <Text style={styles.contactItem}>{personalInfo.linkedin}</Text>
              </View>
            ) : null}
            {personalInfo.website ? (
              <View style={{ marginBottom: 6 }}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactItem}>{personalInfo.website}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ── BODY ── */}
        <View style={styles.body}>
          {/* ── WORK EXPERIENCE ── */}
          {workExperience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {workExperience.map((job, i) => (
                <View key={i} style={styles.entryBlock}>
                  <View style={styles.entryHeader}>
                    <View>
                      <Text style={styles.entryTitle}>{job.title || "Job Title"}</Text>
                      <Text style={styles.entryCompany}>{job.company || "Company"}</Text>
                    </View>
                    <Text style={styles.entryDate}>
                      {job.startDate || "Start"} — {job.current ? "Present" : job.endDate || "End"}
                    </Text>
                  </View>
                  {job.bullets
                    .filter((b) => b.trim())
                    .map((bullet, bIdx) => (
                      <View key={bIdx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>▸</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                </View>
              ))}
            </View>
          )}

          {/* ── EDUCATION ── */}
          {education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Education</Text>
              {education.map((edu, i) => (
                <View key={i} style={styles.entryBlock}>
                  <View style={styles.eduRow}>
                    <View>
                      <Text style={styles.entryTitle}>
                        {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                      </Text>
                      <Text style={styles.entryCompany}>
                        {edu.school}{edu.grade ? ` — ${edu.grade}` : ""}
                      </Text>
                    </View>
                    <Text style={styles.entryDate}>{edu.year}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* ── SKILLS ── */}
          {skills.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Skills</Text>
              <View style={styles.skillsContainer}>
                {skills.map((skill, i) => (
                  <Text key={i} style={styles.skillChip}>
                    {skill}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* ── CERTIFICATIONS ── */}
          {certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Certifications</Text>
              {certifications.map((cert, i) => (
                <View key={i} style={styles.certRow}>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certMeta}>
                    {cert.issuer}{cert.year ? ` · ${cert.year}` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
