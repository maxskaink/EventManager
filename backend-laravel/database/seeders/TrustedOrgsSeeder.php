<?php

namespace Database\Seeders;

use App\Models\TrustedOrg;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * TrustedOrgsSeeder
 *
 * Seeds the trusted_orgs table with organization data from the legacy config files.
 * This ensures that all trusted organizations are available in the database when
 * the application starts.
 */
class TrustedOrgsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Organizations are loaded from three sources:
     * - trusted_certificates.php
     * - trusted_events.php
     * - trusted_publications.php
     *
     * If an organization appears in multiple lists, the flags are merged.
     */
    public function run(): void
    {
        // Organizations trusted for certificates
        $certificateOrgs = [
            // Global learning platforms
            'coursera.org',
            'edx.org',
            'udemy.com',
            'pluralsight.com',
            'skillshare.com',
            'futurelearn.com',
            'linkedin.com',              // LinkedIn Learning
            'khanacademy.org',

            // Major tech companies
            'google.com',                // Google Career Certificates
            'microsoft.com',             // Microsoft Learn
            'ibm.com',                   // IBM Skills Network
            'aws.amazon.com',            // AWS Training and Certification
            'oracle.com',                // Oracle University
            'nvidia.com',                // NVIDIA Deep Learning Institute
            'huawei.com',                // Huawei ICT Academy
            'meta.com',                  // Meta (Facebook) Blueprint
            'apple.com',                 // Apple Training
            'redhat.com',                // Red Hat Certification
            'cisco.com',                 // Cisco Networking Academy
            'dell.com',                  // Dell Technologies Education
            'intel.com',                 // Intel Developer Zone
            'salesforce.com',            // Salesforce Trailhead
            'adobe.com',                 // Adobe Certified Professional
            'autodesk.com',              // Autodesk Certified User
            'siemens.com',               // Siemens Learning Campus
            'sap.com',                   // SAP Learning Hub

            // Security & professional certifications
            'isc2.org',                  // (ISC)²
            'comptia.org',               // CompTIA
            'pmi.org',                   // Project Management Institute
            'isaca.org',                 // ISACA certifications
            'ec-council.org',            // EC-Council (CEH, CHFI)
            'axelos.com',                // ITIL / PRINCE2

            // Cloud & DevOps
            'hashicorp.com',             // HashiCorp Certification
            'docker.com',                // Docker Certification
            'kubernetes.io',             // CNCF / Kubernetes
            'linuxfoundation.org',       // Linux Foundation
            'jenkins.io',                // Jenkins Certified Engineer
            'terraform.io',              // Terraform Associate

            // Universities & education institutions
            'harvard.edu',
            'stanford.edu',
            'mit.edu',
            'berkeley.edu',
            'cam.ac.uk',
            'ox.ac.uk',
            'upenn.edu',
            'princeton.edu',
            'caltech.edu',
            'nus.edu.sg',                // National University of Singapore
            'tudelft.nl',                // TU Delft
        ];

        // Organizations trusted for events
        $eventOrgs = [
            'ieee.org',
            'acm.org',
            'eventbrite.com',
            'mit.edu',
            'harvard.edu',
            'coursera.org',
            'edx.org',
            'stanford.edu',
            'un.org',
            'unesco.org',
            'mintic.gov.co',
        ];

        // Organizations trusted for publications
        $publicationOrgs = [
            'ieee.org',
            'springer.com',
            'sciencedirect.com',
            'nature.com',
            'researchgate.net',
            'acm.org',
            'elsevier.com',
            'scielo.org',
            'tandfonline.com',
        ];

        // Merge all organizations and set appropriate flags
        $allOrgs = array_unique(array_merge($certificateOrgs, $eventOrgs, $publicationOrgs));

        foreach ($allOrgs as $org) {
            TrustedOrg::updateOrCreate(
                ['org' => $org],
                [
                    'trusted_for_certificate' => in_array($org, $certificateOrgs),
                    'trusted_for_event' => in_array($org, $eventOrgs),
                    'trusted_for_publication' => in_array($org, $publicationOrgs),
                ]
            );
        }

        $this->command->info('Trusted organizations seeded successfully!');
        $this->command->info('Total organizations: ' . count($allOrgs));
        $this->command->info('Trusted for certificates: ' . count($certificateOrgs));
        $this->command->info('Trusted for events: ' . count($eventOrgs));
        $this->command->info('Trusted for publications: ' . count($publicationOrgs));
    }
}
