# Technology Maturity Criteria

Extracted from: MITA 4 Maturity Model Guide_Pilot-TA Subgroup Update-0426.docx

## Technology Infrastructure Management

Assess the Technical Architecture maturity of the Medicaid Enterprise System (MES).

### Compute and Storage

**Aspect Question:** Does the MES have servers on premise, hybrid, or cloud with routine, scheduled backup?

#### Level 1: Initial

**Description:** The MES uses physical servers, with little or no virtualization, with backup and storage is addressed ad-hoc.

**Questions:**

- Are most MES servers physical?
- Are backups performed manually?

**Evidence:**

- Infrastructure diagrams, server inventory, operations documentation
- Backup Logs, backup procedures.

#### Level 2: Developing

**Description:** Some virtualization is used for the MES, with servers provisioned manually and storage and backups scheduled.

**Questions:**

- Is the MES using virtualization?
- Are backups scheduled and monitored?

**Evidence:**

- Infrastructure diagrams, server inventory, operations documentation
- Storage/Backup schedules, operations procedures / documentation.

#### Level 3: Defined

**Description:** The MES is on premise and cloud environment, with resources provisioned through standard configurations and scripting, and automated backups of business-critical data.

**Questions:**

- Does the MES use cloud hosting for some services?
- Do backups adhere to a retention schedule?

**Evidence:**

- Architecture Diagram
- Retention Documentation, operations procedures / documentation.

#### Level 4: Managed

**Description:** The MES uses cloud-based environments that are governed through standardized templates, and automation is used to manage storage and backups for growth, volume, and retention.

**Questions:**

- Does the MES provision servers and storage through automation?
- Are MES server and storage costs reviewed?

**Evidence:**

- Automation documentation
- Cost / Utilization metrics, documentation of reviews and decisions made

#### Level 5: Optimized

**Description:** The MES has cloud compute and hosting infrastructure across environments, immutable backups are retained based on retention schedule, compute / storage usage and cost thresholds defined and regularly reviewed.

**Questions:**

- Is the MES cloud native?
- Are storage and backups immutable and retention automated?

**Evidence:**

- Architecture Diagrams, system documentation
- Storage and backup documentation and automation processes

### Networking and Technical Recovery

**Aspect Question:** Does the MES have network segmentation that is regularly tested for outages and recovery?

#### Level 1: Initial

**Description:** The MES is a flat network, with limited monitoring for network traffic, and unplanned outages that are manually resolved.

**Questions:**

- Does the MES have network segmentation?
- Is there a documented technical recovery approach?

**Evidence:**

- Network architecture diagram
- Technical Recovery Documentation

#### Level 2: Developing

**Description:** The MES has some segmentation and network traffic logs are reviewed, manual testing of failovers and restorations occurs.

**Questions:**

- Are resources in place to manage network traffic securely?
- Are technical recovery plans annually tested?

**Evidence:**

- Network architecture diagram, network access documentation
- Technical Recovery Testing Schedule and results

#### Level 3: Defined

**Description:** The MES has network segmentation, with defined networking patterns, and Recovery Time Objective (RTO) and Recovery Point Objective (RPO) defined in Service Level Agreements (SLAs).

**Questions:**

- Does the MES network have standardization across environments?
- Does the technical recovery approach have metrics defined?

**Evidence:**

- Network architecture patterns/diagram
- RTO, RPO, SLAs

#### Level 4: Managed

**Description:** The MES monitors network traffic and has adopted standard patterns, and scheduled testing of failover and restoration of services regularly occurs, with SLAs monitored and reported.

**Questions:**

- Is network performance and alerting available and implemented?
- Are technical recovery plans regularly tested and recovery measured against metrics?

**Evidence:**

- Network monitoring and alerting patterns
- Technical Recovery Testing Schedule and results

#### Level 5: Optimized

**Description:** The MES network is proactively reviewed, and network performance is continuously optimized during peak usage, and the MES has automated failover and restoration ability, with redundancy of environments and limited or no user impact.

**Questions:**

- Is automation and advanced networking in place?
- Are system outages proactively mitigated?

**Evidence:**

- Network analytics, routing documentation
- Downtime/outage mitigation documentation

### Identity, Access, and Consent

**Aspect Question:** Does the MES have identity, access, and consent services for internal and external users?

#### Level 1: Initial

**Description:** The MES has limited ability to manage user identity and access, and consent is captured manually for Medicaid applicants and members.

**Questions:**

- Are accounts and access manually provisioned?
- Is consent captured manually?

**Evidence:**

- Identity Management documentation
- Consent Form documentation

#### Level 2: Developing

**Description:** The MES has user identity and access standardized for new systems and some systems capture consent for Medicaid applicants and members, and consent revocation is manual.

**Questions:**

- Are account management processes defined?
- Is consent revocation captured manually?

**Evidence:**

- Identity management, verification, and access request process documentation
- Revocation Form documentation

#### Level 3: Defined

**Description:** The MES uses centralized identity and access management for most applications with Roles Based Access Control (RBAC), and Medicaid applicant and member consent, preferences, and revocation is collected and auditable within most Medicaid applications in the MES.

**Questions:**

- Is Roles Based Access Control in place for the MES and managed centrally?
- Is consent and revocation electronically captured?

**Evidence:**

- RBAC documentation, identity management architecture diagram
- Consent and Revocation workflow diagrams

#### Level 4: Managed

**Description:** The MES uses centralized identity and access management, RBAC, and activities are logged, auditable, with Medicaid applicant and member consent, preferences, and revocation centrally managed.

**Questions:**

- Are user identity and access automated and audited?
- Is Consent centrally managed?

**Evidence:**

- Identity management architecture diagram
- Consent service documentation

#### Level 5: Optimized

**Description:** The MES integrates entify and access management across internal and external systems and organizations, with continuous improvement and automation, and Medicaid applicant and member consent, preferences, and revocation are user managed, and shared across internal and external MES systems and Medicaid organizations.

**Questions:**

- Is identity and access management integrated across internal and external systems and organizations?
- Is member consent and revocation of member or applicant defined and shared across systems?

**Evidence:**

- Identity integration diagrams
- Consent service documentation

### Security Protection and Monitoring

**Aspect Question:** Does the MES have security controls, with incident logging and monitoring?

#### Level 1: Initial

**Description:** The MES has security controls inconsistently applied, and security monitoring is inconsistent with limited visibility and alerting.

**Questions:**

- Are security controls drafted?
- Is monitoring siloed or inconsistent?

**Evidence:**

- Security controls documentation
- Security Monitoring documentation

#### Level 2: Developing

**Description:** The MES has security controls defined and partially implemented, monitoring and alerts are manually reviewed.

**Questions:**

- Are security processes defined?
- Are security monitoring guidelines defined?

**Evidence:**

- Security process documentation
- Monitoring, Logging, and Alerting guidelines

#### Level 3: Defined

**Description:** The MES has security controls that are implemented across Medicaid applications, with data encrypted, and monitoring and logs are reviewed.

**Questions:**

- Are security controls implemented across the MES?
- Are internal security audits conducted?
- Are alerts and logs collected?

**Evidence:**

- Security diagrams and security control inventory
- Audit process
- Logging/Alerting Rules

#### Level 4: Managed

**Description:** The MES has consistently implemented security controls, regular auditing, and automated checks and security events or incidents alerting.

**Questions:**

- Are security controls monitored and updated for the MES?
- Are security event or incident plans tested?

**Evidence:**

- Security Diagrams, security control monitoring logs
- Test Planning and Results

#### Level 5: Optimized

**Description:** The MES has security controls that are continuously optimized, audited, and validated, and monitoring supports compliance and audit readiness, exceeding federal and state regulatory expectations.

**Questions:**

- Do security controls meet or exceed state and federal regulatory expectations?
- Are threat analytics reviewed proactively?

**Evidence:**

- Security control inventory and monitoring logs
- Metrics and Reporting

### System Operations and Monitoring

**Aspect Question:** Does the MES have standard operating practices and monitoring of performance?

#### Level 1: Initial

**Description:** The MES has manual operations with limited documentation with system logs reviewed for performance.

**Questions:**

- Are system operations documented?
- Is monitoring limited to specific applications or environments?

**Evidence:**

- System Operations Documentation
- Logs, Alerts

#### Level 2: Developing

**Description:** The MES has manual operations with partial process and procedure documentation and guidelines for monitoring performance.

**Questions:**

- Are system operation processes documented?
- Are monitoring and alerting standards defined?

**Evidence:**

- System operations documentation
- Monitoring guidance

#### Level 3: Defined

**Description:** The MES has operations that follow internal procedures with service level agreements, and alerts and monitoring of MES application performance and health.

**Questions:**

- Is the quality of system operations defined and measured?
- Is monitoring and alerting implemented?

**Evidence:**

- System operations documentation, SLAs with metrics
- Monitoring and alerting rules, documentation, and diagrams

#### Level 4: Managed

**Description:** The MES has operations that follow industry standard processes, are automated where feasible, with monitoring and alerting integrated with systems operations.

**Questions:**

- Are system operation processes automated where feasible?
- Is monitoring and alerting automated for critical applications?

**Evidence:**

- System operations documentation, with SLA and metrics
- Monitoring and alerting rules, documentation, and diagrams

#### Level 5: Optimized

**Description:** The MES has operations that are benchmarked and continuously improved and aligned with industry standard processes, monitoring and alerting analytics are centralized for MES application performance and health

**Questions:**

- Are system operations fully automated, aligned with SLAs, and continually improved?
- Is monitoring and alerting automated and centralized?

**Evidence:**

- System operations documentation with SLA and metrics
- Monitoring and alerting rules, documentation, and diagrams

### Development, Testing, Release and Security Compliance

**Aspect Question:** Does the MES have centralized source and script management with testing and security reviews?

#### Level 1: Initial

**Description:** The MES has no version control of source code or scripts, manual testing, and limited security compliance checks.

**Questions:**

- Are source code and scripts managed manually without automated version control?
- Is testing manual?
- Are security reviews inconsistent?

**Evidence:**

- Development and configuration procedures
- Testing process documentation
- Security review checklist, development documentation including secure coding standards

#### Level 2: Developing

**Description:** The MES has basic version control of source code or scripts, releases and testing follow checklists, and manual security compliance reviews occur.

**Questions:**

- Is version control of source code and scripts used for some systems?
- Are testing activities repeatable across teams?
- Is security review included in testing?

**Evidence:**

- Development and configuration procedures
- Testing process documentation, testing checklists
- Testing process documentation, testing checklists, records from prior application security testing

#### Level 3: Defined

**Description:** The MES has standardized version control of source code and scripts, pre-production environments are defined, release and testing procedures are defined, and security reviews are standardized.

**Questions:**

- Is version control of source code and scripts standardized across all teams?
- Are release procedures used?
- Are secure coding standards implemented?

**Evidence:**

- Development and configuration procedures, environment architecture
- Development and release process documentation
- Development documentation including secure coding standards

#### Level 4: Managed

**Description:** The MES has centralized version control of source code and scripts, release and testing are automated across pre-production environments, testing metrics are reviewed, and security reviews occur with release planning.

**Questions:**

- Is version control of source code and scripts centralized?
- Are pre-production environments in place with release automation?
- Are security reviews part of release planning?

**Evidence:**

- Development and configuration documentation
- Environment diagrams and release workflow documentation
- Release process documentation

#### Level 5: Optimized

**Description:** The MES has automated source code and script management, releases are continuous across pre-production and production environments, releases are monitored, and continuous security reviews and compliance are performed.

**Questions:**

- Is source code and script version control automated?
- Are releases continuously deployed across pre-production and production environments as applicable?
- Are continuous security and compliance reviews automated during development? and compliance in place?

**Evidence:**

- Development, configuration, and release process documentation
- Release process documentation, environment diagrams and workflow documentation
- Development documentation including secure coding standards, compliance review metrics.

## Application Management

Assess the Technical Architecture maturity of the application or module for a Domain/Area's capability.

### API, Messaging, and Integration

**Aspect Question:** Does the Medicaid application connect and interface with other internal or external systems or organizations?

#### Level 1: Initial

**Description:** The MES application or module supporting the capability connects to other systems for a single, limited purpose using a API, interface, or manual batch file exchange with limited documentation.

**Questions:**

- Does each API or interface serve a single purpose?
- Is data exchanged manually or ad-hoc between systems?
- Are external organization (vendor networks, clearinghouses) connections known?

**Evidence:**

- API/Interface Inventory and documentation
- Operations documentation
- : External Connection Documentation

#### Level 2: Developing

**Description:** The MES application or module supporting the capability connects through an API, interface, or scheduled batch file exchange that is documented and listed in an inventory.

**Questions:**

- Are APIs or interfaces documented?
- Is data scheduled between systems?
- Is there an inventory of external organization connections?

**Evidence:**

- API/Interface Inventory and documentation
- Operations documentation
- External Connection Documentation

#### Level 3: Defined

**Description:** The MES application or module supporting the capability uses APIs or interfaces that follow industry standards, and all external connections follow a documented process.

**Questions:**

- Does each API or Interface and data formats follow to industry standards?
- Are external connections consistently established?

**Evidence:**

- Interface Pattern/Architecture Diagram
- External Connection Documentation including processes for establishing new connections

#### Level 4: Managed

**Description:** The MES application or module supporting the capability uses APIs or interfaces initiated by events where appropriate, published and versioned through an API Management tool, and consistently apply industry standards.

**Questions:**

- Is each API or interface managed and documented in a central location?
- Do business events trigger automation to exchange data?

**Evidence:**

- API/Interface Management documentation
- Architecture diagram, Business workflow diagrams, API/Interface Inventory and documentation

#### Level 5: Optimized

**Description:** The MES application or module supporting the capability uses APIs or interfaces that fully conform with industry standards, continuously optimized through automated adjustments, and all external connections managed.

**Questions:**

- Are APIs or interfaces proactively optimized?
- Are patterns in place to standardize the consistent development of APIs and interfaces, and external connections?

**Evidence:**

- API/Interface Inventory and documentation, interface performance metrics
- Enterprise patterns, development and configuration procedures

### Application Hosting and Platform Services

**Aspect Question:** Is the Medicaid application hosted in a dedicated MES environment with common platform services reused?

#### Level 1: Initial

**Description:** The MES application or module supporting the capability is hosted in an environment with limited documentation and inconsistent configurations.

**Questions:**

- Are applications documented?

**Evidence:**

- Application documentation including Inventory and deployment guides

#### Level 2: Developing

**Description:** The MES application or module supporting the capability is hosted in an environment that is documented standardization of MES hosting practices piloted.

**Questions:**

- Are applications hosted in standardized environments?

**Evidence:**

- Application documentation including Inventory and deployment guides

#### Level 3: Defined

**Description:** The MES application or module supporting the capability is hosted in an environment that adopts and follows standard hosting patterns, with some common services available in the MES.

**Questions:**

- Do environments hosting applications offer common resources?

**Evidence:**

- Architecture Diagram, Internal Service Catalog, service use documentation

#### Level 4: Managed

**Description:** The MES application or module supporting the capability is hosted in an environment that applies standards to limit complexity, supports automation, and resources are shared across MES hosting environments.

**Questions:**

- Does the application’s hosting environment support automation?

**Evidence:**

- Architecture Diagram, Internal Service Catalog, service API documentation

#### Level 5: Optimized

**Description:** The MES application or module supporting the capability is hosted in an environment that is proactively managed, uses automation to improve application performance and reliability, and resources are widely reused across MES hosting environments.

**Questions:**

- Are the application hosting environments cloud native and adaptive?

**Evidence:**

- Application Architecture Diagrams including cloud-native patterns, Internal Service Catalog, service API documentation

### Business Rules and Workflow

**Aspect Question:** Does the Medicaid application enable and support SMA business processes?

#### Level 1: Initial

**Description:** The MES application or module supporting the capability has business rules or workflows that are hard-coded and require technical staff to change.

**Questions:**

- Are business rules and workflows limited to a single application?

**Evidence:**

- Application documentation, Workflow or Process Diagram

#### Level 2: Developing

**Description:** The MES application or module supporting the capability has business rules or workflows that are hard-coded but are documented for internal use by technical staff.

**Questions:**

- Are business rules and workflows documented?

**Evidence:**

- Application documentation, Business Rules and Workflow Technical Documentation

#### Level 3: Defined

**Description:** The MES application or module supporting the capability has business rules or workflows that are documented in a human-readable format and maintained separately from scripts or code.

**Questions:**

- Are business rules and workflows documented in human readable format?
- Application documentation, Business Rules and Workflow Technical Documentation

**Evidence:**

- Business Rules and Business Process documentation

#### Level 4: Managed

**Description:** The MES application or module supporting the capability has business rules or workflows that are externalized from scripts or source code and reused across multiple applications or modules.

**Questions:**

- Are business rules and workflows rules externalized for reuse across applications that share dependencies?

**Evidence:**

- Architecture diagram and documentation, Application documentation, Business Rules and Workflow Technical Documentation

#### Level 5: Optimized

**Description:** The MES application or module supporting the capability has business rules and workflows that are fully externalized, versioned, and reused across the MES, and adjusted through policy-informed automation.

**Questions:**

- Do business rules and business processes follow industry standards?
- Can business users configure business rules?

**Evidence:**

- Business process and business rules standards and patterns
- Application documentation, Business Rules and Workflow Technical Documentation

### Modular Architecture

**Aspect Question:** Can the Medicaid application and its services be changed or updated without impacting the system?

#### Level 1: Initial

**Description:** The MES application or module supporting capability is a large, complex system where changes require system-level updates.

**Questions:**

- Do updates for applications require system-level changes?

**Evidence:**

- Application Architecture Diagrams

#### Level 2: Developing

**Description:** The MES application or module supporting the capability has some services that are considered candidates for modularity.

**Questions:**

- Are common services identified as candidates for leverage and reuse?

**Evidence:**

- Modularity Planning

#### Level 3: Defined

**Description:** The MES application or module supporting capability has common services that can be deployed independently of the application or module.

**Questions:**

- Are modularity or service patterns defined?

**Evidence:**

- Architecture Patterns or Standards

#### Level 4: Managed

**Description:** The MES application or module supporting the capability has common services that are reused by other MES applications and modules to reduce redundancy.

**Questions:**

- Can services be changed or updated without impacting the entire application?

**Evidence:**

- Resource/Service Inventory, Architecture Patterns or Standards

#### Level 5: Optimized

**Description:** The MES application or module supporting the capability is fully composable with discrete services to allow independent and adaptive changes.

**Questions:**

- Is the application fully composable with services shared across applications?

**Evidence:**

- Architecture Diagrams

### User Interfaces and Session Management

**Aspect Question:** Does the Medicaid application have standardized user interfaces, responsive design, accessibility testing, and maintain SMA user progress?

#### Level 1: Initial

**Description:** The MES application or module supporting the capability has user interfaces that are inconsistently designed and have limited support for accessibility, user progress is not maintained.

**Questions:**

- Are user interfaces inconsistent?
- Are user interfaces accessible?
- Is a user session maintained?

**Evidence:**

- User interface documentation and standards
- Accessibility testing results
- Application documentation, presence or lack of user persistence

#### Level 2: Developing

**Description:** The MES application or module supporting the capability has some usability testing conducted, and user interfaces have some standardization, with limited ability to maintain user progress.

**Questions:**

- Are some user interfaces standardized?
- Are user interfaces accessible?
- Is session persistence available for a duration of time?

**Evidence:**

- User interface documentation and standards
- Accessibility testing checklists and results
- Application documentation, user timeout configuration

#### Level 3: Defined

**Description:** The MES application or module supporting the capability has standardized user interface and user feedback is collected for planning improvements, and users can resume progress.

**Questions:**

- Are standardized frontend components used for the application?
- Are user interfaces accessible?
- Can a user start, stop, and reuse progress in a application?

**Evidence:**

- Component inventory
- Accessibility testing checklists and results
- Application documentation, user session management pattern documentation

#### Level 4: Managed

**Description:** The MES application or module supporting the capability has responsive design across different devices and browsers and accessibility testing is automated; users can maintain progress across devices.

**Questions:**

- Can the user interface support different devices or browsers?
- Is accessibility testing automated?
- Can a user start, stop, and resume progress on the same device?

**Evidence:**

- Application frontend documentation, User interface documentation and standards
- Automated accessibility testing procedures and results
- Application documentation, user session management pattern documentation

#### Level 5: Optimized

**Description:** The MES application or module supporting the capability allows user interface personalization and user feedback informs continuous improvement of the front-end experience, users sessions are context-aware and preserved across devices and browsers.

**Questions:**

- Can the user interface be personalized?
- Is accessibility testing automated?
- Can a user start, stop, and resume progress on different devices or browsers?

**Evidence:**

- Application frontend documentation
- Application frontend design standards and reusable components
- Automated accessibility testing procedures and results
- Application documentation, user session management pattern documentation
