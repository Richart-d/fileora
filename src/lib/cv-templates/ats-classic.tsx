import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ResumeData } from "@/types/resume";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    color: "#222222",
    lineHeight: 1.4,
  },

  /* ── Header ── */
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
    paddingBottom: 10,
  },
  name: {
    fontFamily: "Helvetica-Bold",
    fontSize: 22,
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    fontSize: 9,
    color: "#444444",
  },
  contactItem: {
    marginRight: 8,
  },
  separator: {
    marginHorizontal: 4,
    color: "#999999",
  },

  /* ── Section ── */
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: "#AAAAAA",
    paddingBottom: 3,
  },

  /* ── Summary ── */
  summaryText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.5,
  },

  /* ── Experience ── */
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  entryTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
  },
  entrySubtitle: {
    fontSize: 10,
    color: "#555555",
    fontFamily: "Helvetica-Oblique",
  },
  entryDate: {
    fontSize: 9,
    color: "#666666",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 10,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.5,
  },
  entryBlock: {
    marginBottom: 8,
  },

  /* ── Education ── */
  eduRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  /* ── Skills ── */
  skillsText: {
    fontSize: 10,
    lineHeight: 1.6,
  },

  /* ── Certifications ── */
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
});

interface Props {
  data: ResumeData;
}

export function ATSClassicTemplate({ data }: Props) {
  const { personalInfo, summary, workExperience, education, skills, certifications } = data;

  const contactParts: string[] = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin);
  if (personalInfo.website) contactParts.push(personalInfo.website);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {personalInfo.name || "Your Name"}
          </Text>
          <View style={styles.contactRow}>
            {contactParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <Text style={styles.separator}>|</Text>}
                <Text style={styles.contactItem}>{part}</Text>
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── PROFESSIONAL SUMMARY ── */}
        {summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        ) : null}

        {/* ── WORK EXPERIENCE ── */}
        {workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Experience</Text>
            {workExperience.map((job, i) => (
              <View key={i} style={styles.entryBlock}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>{job.title || "Job Title"}</Text>
                  <Text style={styles.entryDate}>
                    {job.startDate || "Start"} — {job.current ? "Present" : job.endDate || "End"}
                  </Text>
                </View>
                <Text style={styles.entrySubtitle}>{job.company || "Company"}</Text>
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

        {/* ── EDUCATION ── */}
        {education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, i) => (
              <View key={i} style={styles.entryBlock}>
                <View style={styles.eduRow}>
                  <Text style={styles.entryTitle}>
                    {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                  </Text>
                  <Text style={styles.entryDate}>{edu.year}</Text>
                </View>
                <Text style={styles.entrySubtitle}>
                  {edu.school}{edu.grade ? ` — ${edu.grade}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── SKILLS ── */}
        {skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.skillsText}>{skills.join("  •  ")}</Text>
          </View>
        )}

        {/* ── CERTIFICATIONS ── */}
        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert, i) => (
              <View key={i} style={styles.certRow}>
                <Text style={styles.entryTitle}>{cert.name}</Text>
                <Text style={styles.entryDate}>
                  {cert.issuer}{cert.year ? `, ${cert.year}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
