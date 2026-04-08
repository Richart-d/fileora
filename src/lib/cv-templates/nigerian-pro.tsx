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

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: DARK,
    lineHeight: 1.5,
    padding: 40,
  },
  header: {
    borderBottomWidth: 3,
    borderBottomColor: NAVY,
    paddingBottom: 15,
    marginBottom: 20,
    alignItems: "center",
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 26,
    color: NAVY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 12,
    color: TEAL,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    fontSize: 9,
    color: MUTED,
  },
  summary: {
    fontSize: 10,
    marginBottom: 20,
    textAlign: "justify",
  },
  nyscBadge: {
    backgroundColor: "rgba(13, 148, 136, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: TEAL,
    marginBottom: 20,
  },
  nyscText: {
    color: TEAL,
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 13,
    color: NAVY,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 4,
    marginBottom: 10,
  },
  /* ── Entries ── */
  entryBlock: {
    marginBottom: 12,
  },
  entryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    color: DARK,
  },
  entryOrg: {
    fontSize: 10,
    color: NAVY,
    fontFamily: "Helvetica-Oblique",
  },
  entryDate: {
    fontSize: 9,
    color: MUTED,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 12,
    fontSize: 10,
    color: NAVY,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.4,
  },
  /* ── Education ── */
  eduGradeInfo: {
    fontSize: 9.5,
    fontFamily: "Helvetica-Bold",
    color: TEAL,
    marginTop: 2,
  },
  /* ── Skills & Certs ── */
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  skillItem: {
    fontSize: 9.5,
    backgroundColor: "rgba(30, 58, 95, 0.05)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 3,
    fontFamily: "Helvetica-Bold",
    color: NAVY,
  },
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

export function NigerianProTemplate({ data }: Props) {
  const { personalInfo, summary, workExperience, education, skills, certifications, nyscStatus } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name || "Your Name"}</Text>
          {data.title && data.title !== "Untitled Resume" && (
            <Text style={styles.title}>{data.title}</Text>
          )}
          <View style={styles.contactInfo}>
            {personalInfo.email && <Text>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text>•   {personalInfo.phone}</Text>}
            {personalInfo.location && <Text>•   {personalInfo.location}</Text>}
            {personalInfo.linkedin && <Text>•   {personalInfo.linkedin}</Text>}
            {personalInfo.website && <Text>•   {personalInfo.website}</Text>}
          </View>
        </View>

        {/* SUMMARY */}
        {summary ? <Text style={styles.summary}>{summary}</Text> : null}

        {/* NYSC STATUS (Nigeria specific) */}
        {nyscStatus && nyscStatus.trim() !== "" ? (
          <View style={styles.nyscBadge}>
            <Text style={styles.nyscText}>NYSC Status: {nyscStatus}</Text>
          </View>
        ) : null}

        {/* WORK EXPERIENCE */}
        {workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {workExperience.map((job, i) => (
              <View key={i} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <View>
                    <Text style={styles.entryTitle}>{job.title || "Job Title"}</Text>
                    <Text style={styles.entryOrg}>{job.company || "Company"}</Text>
                  </View>
                  <Text style={styles.entryDate}>
                    {job.startDate || "Start"} — {job.current ? "Present" : job.endDate || "End"}
                  </Text>
                </View>
                {job.bullets
                  .filter((b) => b.trim())
                  .map((bullet, bIdx) => (
                    <View key={bIdx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{bullet}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.entryBlock}>
                <View style={styles.entryHeaderRow}>
                  <View>
                    <Text style={styles.entryTitle}>
                      {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                    </Text>
                    <Text style={styles.entryOrg}>{edu.school}</Text>
                    {edu.grade && <Text style={styles.eduGradeInfo}>{edu.grade}</Text>}
                  </View>
                  <Text style={styles.entryDate}>{edu.year}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Core Skills</Text>
            <View style={styles.skillsContainer}>
              {skills.map((skill, i) => (
                <Text key={i} style={styles.skillItem}>
                  {skill}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications & Awards</Text>
            {certifications.map((cert, i) => (
              <View key={i} style={styles.certRow}>
                <View>
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certMeta}>{cert.issuer}</Text>
                </View>
                <Text style={styles.certMeta}>{cert.year}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
