import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Terms = () => {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Text style={styles.header}>Terms and Conditions</Text>
        
        <Text style={styles.content}>
          1. Introduction
          Welcome to SAVI. These Terms and Conditions govern your relationship with SAVI. Please read these Terms and Conditions carefully before using our Service. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
        </Text>
        
        <Text style={styles.content}>
          2. Acceptance of Terms
          By accessing or using the Service, you signify your agreement to these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use the Service.
        </Text>
        
        <Text style={styles.content}>
          3. Eligibility
          You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are at least 18 years old.
        </Text>
        
        <Text style={styles.content}>
          4. Accounts
          4.1 Registration
          To use certain features of the Service, you must register for an account. When you register, you agree to provide accurate, current, and complete information about yourself. You agree to update this information promptly to keep it accurate, current, and complete.
        </Text>
        
        <Text style={styles.content}>
          4.2 Account Security
          You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer or device. You agree to accept responsibility for all activities that occur under your account or password.
        </Text>
        
        <Text style={styles.content}>
          4.3 Unauthorized Use
          You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
        </Text>
        
        <Text style={styles.content}>
          5. User Responsibilities
          5.1 Lawful Use
          You agree to use the Service only for lawful purposes and in accordance with these Terms. You are prohibited from using the Service to engage in any activity that is illegal, harmful, or otherwise objectionable.
        </Text>
        
        <Text style={styles.content}>
          5.2 Prohibited Activities
          You agree not to engage in any of the following prohibited activities:
          - Violating any applicable laws or regulations.
          - Infringing upon the intellectual property or other rights of third parties.
          - Transmitting any viruses, worms, defects, or other items of a destructive nature.
          - Using any automated means to access the Service.
          - Harassing, threatening, or defrauding other users.
          - Engaging in any activity that disrupts or interferes with the Service.
        </Text>
        
        <Text style={styles.content}>
          6. Permissions and Access
          6.1 Required Permissions
          To provide our Service, we require certain permissions from you. By using the Service, you grant us the following permissions:
          - Access to your device's location.
          - Access to your device's camera.
          - Access to your device's contacts and storage.
          - Access to other necessary features as required for the Service.
        </Text>
        
        <Text style={styles.content}>
          6.2 Revoking Permissions
          You can choose to revoke these permissions at any time by adjusting your device settings. However, revoking permissions may limit your ability to use certain features of the Service.
        </Text>
        
        <Text style={styles.content}>
          7. Privacy
          Your use of the Service is also governed by our Privacy Policy, which can be found [here](link-to-privacy-policy). Please review our Privacy Policy for information on how we collect, use, and share your information.
        </Text>
        
        <Text style={styles.content}>
          8. Intellectual Property
          8.1 Ownership
          The Service and its original content, features, and functionality are and will remain the exclusive property of [Your Company Name] and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
        </Text>
        
        <Text style={styles.content}>
          8.2 User Content
          By posting or submitting content through the Service, you grant us a non-exclusive, royalty-free, worldwide, and transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform such content in connection with the Service.
        </Text>
        
        <Text style={styles.content}>
          9. Termination
          We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of these Terms.
          If you wish to terminate your account, you may simply discontinue using the Service.
        </Text>
        
        <Text style={styles.content}>
          10. Limitation of Liability
          In no event shall [Your Company Name], nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          - Your use or inability to use the Service.
          - Any unauthorized access to or use of our servers and/or any personal information stored therein.
          - Any interruption or cessation of transmission to or from the Service.
          - Any bugs, viruses, trojan horses, or the like that may be transmitted to or through the Service by any third party.
          - Any errors or omissions in any content or for any loss or damage incurred as a result of the use of any content posted, emailed, transmitted, or otherwise made available through the Service.
        </Text>
        
        <Text style={styles.content}>
          11. Disclaimer
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
        </Text>
        
        <Text style={styles.content}>
          12. Governing Law
          These Terms shall be governed and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions.
        </Text>
        
        <Text style={styles.content}>
          13. Changes to These Terms
          We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </Text>
        
        <Text style={styles.content}>
          14. Contact Us
          If you have any questions about these Terms, please contact us at:
          savi@gmail.com
        </Text>
      </View>
    </ScrollView>
  );
};

export default Terms;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 20,
    marginTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
});













// now for the contribution rules 
// since the it is a weekly payout plan
// contibution payment will be made everyweek meaning contribution days will be every wednesday and thursday. payout everyweek will be like every sundays so the contribution payment days will be like every wednesdays and thursdays of the week till when their contibution is over but i thought of something, what if the group wasnt created like that?? i mean if the group was created like on a monday then this process is ok but waht if the group was created on other days of the week??? then the contibution days will be mixed up so here is what i suggest, days of the week: monday, tuesday, wednesday and thursday(supposed contribution days), friday, saturday and sunday (payout day for the week - if the payout plan was weekly) so since we are skipping two days (monday and tuesday) then wednesday and thursday which are suppose to be the contribution days - if the group was created on a monday, so i want you to help me so it would be like from the day the group was created till two days time (assuming its a monday but its not) e.g the group was created on a thursday, contibution days will be saturday and sunday(assuming am following a full week logic) then payout will be two days after which is wednesday. i hope you understand??? so we can use this logic on any other time of the week

// so oin the pending payment section where the user has to pay the contribution
// let there be a timestamp indicating when the user is supposed to make the contribution payments (regarding or logic above) but the contibution payment section will be locked until the day for contribution is due (meaning the user has two days to make the contribution payment)


// please i hope you understand the logic am talking about???
// here is the code(please just do this and not change styling of anyother thing):
