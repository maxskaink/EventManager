<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Trusted Certificate Issuers (domains)
    |--------------------------------------------------------------------------
    |
    | This list contains trusted organizations commonly recognized on
    | professional platforms such as LinkedIn. Each entry represents the
    | primary domain of a valid certificate issuer.
    |
    */

    'organizations' => [
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
    ],
];
