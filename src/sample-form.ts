import { groupBy } from 'lodash-es'

const questions = [
  {
    "id": "a7f3c9e0-1b2d-4c5e-8f90-1a2b3c4d5e6f",
    "sectionId": "3a1b79d0-be3f-4fff-bad4-e367cc06ae67",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Student Information",
    "description": "",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "InfoCard",
      "icon": "📋",
      "content": [
        { "type": "rows", "rows": [
          { "label": "Name:", "value": "Oscar Diaz" },
          { "label": "Address on File:", "value": "123 Main St, Houston, TX 77002" },
          { "label": "Grade:", "value": "10th" },
          { "label": "Homeroom:", "value": "Ms. Carter — Room 204" }
        ] },
        { "type": "paragraph", "text": "Please review the information above before continuing." },
        { "type": "paragraph", "text": "If anything looks incorrect, update it in the following ways:" },
        { "type": "list", "ordered": false, "items": ["Contact the front office", "Submit a change request form", "Email records@school.edu"] },
        { "type": "list", "ordered": false, "items": ["Verify your name", "Verify your address", "Confirm and submit"] }
      ]
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": -1,
    "customId": "student-information"
  },
  {
    "id": "bb8b8d9b-7a0a-4460-828a-e34040f4decc",
    "sectionId": "3a1b79d0-be3f-4fff-bad4-e367cc06ae67",
    "formId": "f4e59d31-9dc7-4836-828f-989d4cbdfd27",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p>title of the <strong>html</strong> comp</p>",
    "description": "",
    "type": "Html",
    "required": true,
    "defaultValue": "<p>Sample <strong>html table</strong> in the format give by the <strong>paragraph</strong></p><ul><li><p>list item 1</p></li><li><p>list item 2</p></li></ul><p></p>",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "hammad@edwire.com",
    "createdDateTime": "2026-04-27T11:42:30.86Z",
    "lastModifiedBy": "hammad@edwire.com",
    "lastModifiedDateTime": "2026-04-27T14:52:24.723Z",
    "isDeleted": false,
    "order": 0,
    "customId": "html",
    "multiline": false
  },
  {
    "id": "902488d0-f700-4a1c-adcb-84852fc7d7f8",
    "sectionId": "3a1b79d0-be3f-4fff-bad4-e367cc06ae67",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Legend",
    "description": "",
    "type": "Html",
    "required": false,
    "defaultValue": "<table><tbody><tr><td><strong>4</strong> </td><td><strong>3</strong> </td><td><strong>2</strong> </td><td><strong>1</strong> </td><td><strong>N/A</strong> </td></tr><tr><td>Always/Consistently</td><td>Frequently/Almost Always</td><td>Sometimes/Occasionally</td><td>Rarely/Seldom</td><td>Not Observed</td></tr></tbody></table>",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:27:01.515Z",
    "isDeleted": false,
    "order": 0,
    "customId": "legend"
  },
  {
    "id": "d3b61b32-0d9f-4a47-b0ab-7fab87f3463c",
    "sectionId": "34e8ef12-f26b-4623-b2cc-6a0b8486558c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Routines</strong>: Students execute transitions, routines, and procedures in an efficient manner that maximizes instructional time.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:30:45.102Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:18:38.37Z",
    "isDeleted": false,
    "order": 0,
    "customId": "routines-students-execute-transitions-routines-and-procedures-in-an-efficient-manner-that-maximizes-instructional-time"
  },
  {
    "id": "4bd248f3-a3b3-4013-b703-5c422f14348c",
    "sectionId": "34e8ef12-f26b-4623-b2cc-6a0b8486558c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Classroom Management</strong>: Students follow expectations with positive teacher reinforcements. If misbehavior occurs, students are redirected with minimal disruption to instruction.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:32:04.233Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:18:45.588Z",
    "isDeleted": false,
    "order": 1,
    "customId": "classroom-management-students-follow-expectations-with-positive-teacher-reinforcements-if-misbehavior-occurs-students-are-redirected-with-minimal-disruption-to-instruction"
  },
  {
    "id": "bd6122cc-65ac-4ddf-926e-7fe176a0add5",
    "sectionId": "e3126790-6563-460a-b310-af8a52569c9c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Pacing</strong>: The teacher maintains appropriate pacing aligned to the purpose of the planned lesson and driving toward student mastery of the objective.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:33:09.663Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:18:53.009Z",
    "isDeleted": false,
    "order": 0,
    "customId": "pacing-the-teacher-maintains-appropriate-pacing-aligned-to-the-purpose-of-the-planned-lesson-and-driving-toward-student-mastery-of-the-objective"
  },
  {
    "id": "279104fc-0ff6-4c1f-bcab-e404fd9fc5ab",
    "sectionId": "e3126790-6563-460a-b310-af8a52569c9c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Explicit Model</strong>: The teacher explicitly models and thinks aloud grade-level strategies.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:33:30.129Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:19:00.768Z",
    "isDeleted": false,
    "order": 1,
    "customId": "explicit-model-the-teacher-explicitly-models-and-thinks-aloud-grade-level-strategies"
  },
  {
    "id": "4a0e48f3-697b-4a48-8617-d2f4e3c83f5b",
    "sectionId": "e3126790-6563-460a-b310-af8a52569c9c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Academic Language</strong>: The teacher uses precise academic and content language.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:33:40.774Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:19:10.032Z",
    "isDeleted": false,
    "order": 2,
    "customId": "academic-language-the-teacher-uses-precise-academic-and-content-language"
  },
  {
    "id": "f7676f8b-101d-4b94-9b13-7088f4e73f4d",
    "sectionId": "e3126790-6563-460a-b310-af8a52569c9c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Questions & Tasks</strong>: The teacher uses rigorous, meaningful, grade-level questions and tasks that build students’ understanding of the content.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:33:53.631Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:19:18.059Z",
    "isDeleted": false,
    "order": 3,
    "customId": "questions-tasks-the-teacher-uses-rigorous-meaningful-grade-level-questions-and-tasks-that-build-students-understanding-of-the-content"
  },
  {
    "id": "0b7cf7df-a867-4f0f-bc9a-b8efb991731f",
    "sectionId": "e3126790-6563-460a-b310-af8a52569c9c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Frequent Practice</strong>: The teacher provides frequent opportunities for practice using multiple engagement strategies (e.g., independent, partner, and group practice; think-pair-share; turn and talk; everybody writes; whiteboard responses; show call with student work).</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:34:05.85Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:19:25.646Z",
    "isDeleted": false,
    "order": 4,
    "customId": "frequent-practice-the-teacher-provides-frequent-opportunities-for-practice-using-multiple-engagement-strategies-e-g-independent-partner-and-group-practice-think-pair-share-turn-and-talk-everybody-writes-whiteboard-responses-show-call-with-student-work"
  },
  {
    "id": "b5ff3d26-0dcf-4c8c-a2d9-2ec300be1010",
    "sectionId": "e3126790-6563-460a-b310-af8a52569c9c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Breadth of Practice</strong>: All students are engaged in the practice required for mastery in ways that reveal their thinking (e.g., discussion, writing, practice).</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:34:19.445Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:19:32.946Z",
    "isDeleted": false,
    "order": 5,
    "customId": "breadth-of-practice-all-students-are-engaged-in-the-practice-required-for-mastery-in-ways-that-reveal-their-thinking-e-g-discussion-writing-practice"
  },
  {
    "id": "ca4b4237-c4e5-433a-b5c6-ddb9e45dba22",
    "sectionId": "e3126790-6563-460a-b310-af8a52569c9c",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Depth of Practice</strong>: Students do the cognitive work at the depth required for mastery, as called for by the lesson.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:34:32.798Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:19:39.394Z",
    "isDeleted": false,
    "order": 6,
    "customId": "depth-of-practice-students-do-the-cognitive-work-at-the-depth-required-for-mastery-as-called-for-by-the-lesson"
  },
  {
    "id": "4b265322-d083-438e-8baf-399dc3f705c0",
    "sectionId": "1233ed43-226b-4c7d-a12d-4d55fa6c5a92",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Checks for Understanding</strong>: The teacher deliberately checks for understanding through questioning, student work tasks, and formative assessments throughout the lesson.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:35:11.901Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:19:46.467Z",
    "isDeleted": false,
    "order": 0,
    "customId": "checks-for-understanding-the-teacher-deliberately-checks-for-understanding-through-questioning-student-work-tasks-and-formative-assessments-throughout-the-lesson"
  },
  {
    "id": "23230351-c175-4dd4-8993-5c6a5c179202",
    "sectionId": "1233ed43-226b-4c7d-a12d-4d55fa6c5a92",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Monitoring</strong>: The teacher actively monitors student work by circulating the classroom, checking for understanding, and analyzing both verbal and written responses.</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:35:25.052Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:19:54.175Z",
    "isDeleted": false,
    "order": 1,
    "customId": "monitoring-the-teacher-actively-monitors-student-work-by-circulating-the-classroom-checking-for-understanding-and-analyzing-both-verbal-and-written-responses"
  },
  {
    "id": "f7f82078-f87a-4cf4-9988-87abccae92f3",
    "sectionId": "1233ed43-226b-4c7d-a12d-4d55fa6c5a92",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "<p><strong>Responding</strong>: The teacher makes adjustments in response to student learning (e.g., making connections to prior learning and student experience, implementing scaffolds, providing language supports, giving individual feedback, addressing misconceptions, modeling, etc.)</p>",
    "description": "",
    "type": "Scoring",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:35:37.728Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:20:00.445Z",
    "isDeleted": false,
    "order": 2,
    "customId": "responding-the-teacher-makes-adjustments-in-response-to-student-learning-e-g-making-connections-to-prior-learning-and-student-experience-implementing-scaffolds-providing-language-supports-giving-individual-feedback-addressing-misconceptions-modeling-etc"
  },
  {
    "id": "2f13e71b-7972-4a49-83af-1ae9a532a3bf",
    "sectionId": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "If you are observing the mastery of a previously assigned action step, identify the action step.",
    "description": "Select a Category, and then the desired Action Step.",
    "type": "Select",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [
      "Learning Environment",
      "Instructional Delivery",
      "Monitoring & Responding to Student Learning"
    ],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:36:28.122Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-03-31T15:52:04.617Z",
    "isDeleted": false,
    "order": 0,
    "customId": "if-you-are-observing-the-mastery-of-a-previously-assigned-action-step-identify-the-action-step"
  },
  {
    "id": "2380cd44-879c-42f0-890d-8f2bbe246c66",
    "sectionId": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Previous Action Step (Learning Environment)",
    "description": "",
    "type": "Select",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [
      "Plan Critical Routines and Procedures",
      "Use Strong Voice When Giving Instructions",
      "Teach Routines & Procedures",
      "Give What to Do Directions",
      "Redirect Off Task Behavior",
      "Use Whole-Class Reset",
      "Foster a Learning Community"
    ],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-31T15:52:54.169Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-01T16:07:05.755Z",
    "isDeleted": false,
    "order": 1,
    "visibilityCondition": {
      "logic": "AND",
      "rules": [
        {
          "fieldId": "2f13e71b-7972-4a49-83af-1ae9a532a3bf",
          "operator": "equals",
          "value": "Learning Environment"
        }
      ]
    },
    "customId": "previous-action-step-learning-environment"
  },
  {
    "id": "096d2ee5-67ca-492b-95d6-f35dcb181785",
    "sectionId": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Previous Action Step (Instructional Delivery)",
    "description": "",
    "type": "Select",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [
      "Plan for Purposeful Pacing",
      "Use Student Data to Adjust Pacing",
      "Deliver a Focused Direct Teach",
      "Make Thinking Visible",
      "Assign a Thinking Job",
      "Balance the Ratio Between Teacher Voice and Student Practice",
      "Use Think Pair Share to Increase Engagement",
      "Use Everybody Writes to Increase Engagement",
      "Support Depth of Practice",
      "Check for Whole-Group Understanding",
      "Support Productive Struggle"
    ],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-04-01T15:08:37.014Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-01T16:08:59.809Z",
    "isDeleted": false,
    "order": 2,
    "visibilityCondition": {
      "logic": "AND",
      "rules": [
        {
          "fieldId": "2f13e71b-7972-4a49-83af-1ae9a532a3bf",
          "operator": "equals",
          "value": "Instructional Delivery"
        }
      ]
    },
    "customId": "previous-action-step-instructional-delivery"
  },
  {
    "id": "2b2f3802-c90c-4945-a37e-8bc2dbf20528",
    "sectionId": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Previous Action Step (Monitoring & Responding to Student Learning)",
    "description": "",
    "type": "Select",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [
      "Identify Checks for Understanding",
      "Write the Exemplar",
      "Plan for Error",
      "Actively Monitor Student Practice",
      "Give Individual Student Feedback During Independent Work",
      "Use Universal Prompts to Reveal Student Thinking",
      "Use an Explicit Model to Reteach",
      "Use Guided Discourse to Reteach",
      "Use Scaffolds to Increase Access",
      "Scaffold Student Learning through Questioning"
    ],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-04-01T15:11:11.119Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-01T16:10:03.08Z",
    "isDeleted": false,
    "order": 3,
    "visibilityCondition": {
      "logic": "AND",
      "rules": [
        {
          "fieldId": "2f13e71b-7972-4a49-83af-1ae9a532a3bf",
          "operator": "equals",
          "value": "Monitoring & Responding to Student Learning"
        }
      ]
    },
    "customId": "previous-action-step-monitoring-responding-to-student-learning"
  },
  {
    "id": "3358f6ce-d717-4b6c-bf3f-6b5b5fb11f4c",
    "sectionId": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Assign a New Action Step",
    "description": "Select a Category, and then the desired Action Step.",
    "type": "Select",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [
      "Learning Environment",
      "Instructional Delivery",
      "Monitoring & Responding to Student Learning"
    ],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:37:45.003Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-01T15:17:17.388Z",
    "isDeleted": false,
    "order": 4,
    "customId": "assign-a-new-action-step"
  },
  {
    "id": "c6315174-f621-475d-bace-17a1fa846da3",
    "sectionId": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Assigned Action Step (Learning Environment)",
    "description": "",
    "type": "Select",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [
      "Plan Critical Routines and Procedures",
      "Use Strong Voice When Giving Instructions",
      "Teach Routines & Procedures",
      "Give What to Do Directions",
      "Redirect Off Task Behavior",
      "Use Whole-Class Reset",
      "Foster a Learning Community"
    ],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-04-01T15:17:57.274Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-01T16:07:18.932Z",
    "isDeleted": false,
    "order": 5,
    "visibilityCondition": {
      "logic": "AND",
      "rules": [
        {
          "fieldId": "3358f6ce-d717-4b6c-bf3f-6b5b5fb11f4c",
          "operator": "equals",
          "value": "Learning Environment"
        }
      ]
    },
    "customId": "assigned-action-step-learning-environment"
  },
  {
    "id": "ca5ac978-6f12-4594-b45c-9569ee467777",
    "sectionId": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Assigned Action Step (Instructional Delivery)",
    "description": "",
    "type": "Select",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [
      "Plan for Purposeful Pacing",
      "Use Student Data to Adjust Pacing",
      "Deliver a Focused Direct Teach",
      "Make Thinking Visible",
      "Assign a Thinking Job",
      "Balance the Ratio Between Teacher Voice and Student Practice",
      "Use Think Pair Share to Increase Engagement",
      "Use Everybody Writes to Increase Engagement",
      "Support Depth of Practice",
      "Check for Whole-Group Understanding",
      "Support Productive Struggle"
    ],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-04-01T15:22:52.491Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-01T16:09:06.893Z",
    "isDeleted": false,
    "order": 6,
    "visibilityCondition": {
      "logic": "AND",
      "rules": [
        {
          "fieldId": "3358f6ce-d717-4b6c-bf3f-6b5b5fb11f4c",
          "operator": "equals",
          "value": "Instructional Delivery"
        }
      ]
    },
    "customId": "assigned-action-step-instructional-delivery"
  },
  {
    "id": "4a93efc4-d994-4007-8eba-060f846fe832",
    "sectionId": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Assigned Action Step (Monitoring & Responding to Student Learning)",
    "description": "",
    "type": "Select",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 200
    },
    "options": [
      "Identify Checks for Understanding",
      "Write the Exemplar",
      "Plan for Error",
      "Actively Monitor Student Practice",
      "Give Individual Student Feedback During Independent Work",
      "Use Universal Prompts to Reveal Student Thinking",
      "Use an Explicit Model to Reteach",
      "Use Guided Discourse to Reteach",
      "Use Scaffolds to Increase Access",
      "Scaffold Student Learning through Questioning"
    ],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-04-01T15:23:27.092Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-01T16:10:10.748Z",
    "isDeleted": false,
    "order": 7,
    "visibilityCondition": {
      "logic": "AND",
      "rules": [
        {
          "fieldId": "3358f6ce-d717-4b6c-bf3f-6b5b5fb11f4c",
          "operator": "equals",
          "value": "Monitoring & Responding to Student Learning"
        }
      ]
    },
    "customId": "assigned-action-step-monitoring-responding-to-student-learning"
  },
  {
    "id": "6eaa7676-2603-4c19-ab8b-05e09a1481b0",
    "sectionId": "e8530a0a-9e00-44aa-b0cd-24d17eeee2bf",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Observation Notes",
    "description": "",
    "type": "TextArea",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 1000
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:39:19.486Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-03-30T16:39:24.516Z",
    "isDeleted": false,
    "order": 0,
    "customId": "observation-notes"
  },
  {
    "id": "4054ce75-f5b6-4632-9ac1-4980ac27f0a8",
    "sectionId": "e8530a0a-9e00-44aa-b0cd-24d17eeee2bf",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Post-Observation: Praise",
    "description": "",
    "type": "TextArea",
    "required": false,
    "defaultValue": "",
    "validation": {
      "minLength": 0,
      "maxLength": 1000
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:38:47.668Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-03-30T16:39:24.626Z",
    "isDeleted": false,
    "order": 1,
    "customId": "post-observation-praise"
  },
  {
    "id": "0521d87e-26d3-48b4-ac6f-57bdc7b12dd4",
    "sectionId": "e8530a0a-9e00-44aa-b0cd-24d17eeee2bf",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Post-Observation: Area of Growth",
    "description": "",
    "type": "TextArea",
    "required": false,
    "defaultValue": "",
    "multiline": true,
    "validation": {
      "minLength": 0,
      "maxLength": 1000
    },
    "options": [],
    "createdBy": "matt@edwire.com",
    "createdDateTime": "2026-03-30T16:39:04.5Z",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-03-30T16:39:22.727Z",
    "isDeleted": false,
    "order": 2,
    "customId": "post-observation-area-of-growth"
  },
  {
    "id": "f0d1c2b3-a4e5-4f6a-8b7c-9d0e1f2a3b4c",
    "sectionId": "e8530a0a-9e00-44aa-b0cd-24d17eeee2bf",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Date of Observation",
    "description": "Select the date the observation took place",
    "type": "Date",
    "required": false,
    "defaultValue": "",
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": 3,
    "customId": "date-of-observation"
  },
  {
    "id": "e5c1a7b4-8f65-4dce-9a6c-5b9d0e1f2a34",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Privacy Notice",
    "description": "",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "InfoMessage",
      "preText": "🔒 Your privacy matters: ",
      "text": "This information is protected and only used for district reporting as required by the Texas Education Agency. ",
      "body": "This is the body",
      "styles": {
        "bg": "#fff3cd",
        "borderLeft": "4px solid #ffc107",
        "borderRadius": "4px",
        "padding": "20px"
      }
    },
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": 0,
    "customId": "privacy-notice"
  },
  {
    "id": "a1e7c3d0-4b21-4f8a-9c2e-1d5f6a7b8c90",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Observer Email",
    "description": "",
    "type": "CustomComponent",
    "required": true,
    "defaultValue": "",
    "component": {
      "type": "Email",
      "placeholder": "placeholder@example.com",
      "minLength": 5,
      "maxLength": 254
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": 1,
    "customId": "observer-email"
  },
  {
    "id": "b2f8d4e1-5c32-4a9b-8d3f-2e6a7b8c9d01",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "",
    "description": "",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "Or",
      "text": "OR"
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": 2,
    "customId": "contact-separator"
  },
  {
    "id": "c3a9e5f2-6d43-4bac-9e4a-3f7b8c9d0e12",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Observer Phone Number",
    "description": "Format: 123-456-7890",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "Phone",
      "placeholder": "713-456-7890",
      "minLength": 7,
      "maxLength": 20,
      "pattern": "^[+]?[0-9][0-9\\-\\s()]{5,18}[0-9]$"
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": 3,
    "customId": "observer-phone-number"
  },
  {
    "id": "d4b0f6a3-7e54-4cbd-8f5b-4a8c9d0e1f23",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Years of Teaching Experience",
    "description": "Enter a number between 0 and 50",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "Number",
      "minimum": 0,
      "maximum": 50
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": 4,
    "customId": "years-of-teaching-experience"
  },
  {
    "id": "f7d2e8b6-9c87-4f1d-ab4c-7d2e3f4a5b6c",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Date of Birth",
    "description": "Select year, then month, then day",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "DateDropdown",
      "minYear": 1950,
      "maxYear": 1994
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": 5,
    "customId": "date-of-birth"
  },
  {
    "id": "e6c1f7a5-8d76-4e0c-9a3b-6c1d2e3f4a5b",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Enter Verification Code",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "VerificationCode",
      "codeLength": 6
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-15T12:00:00.000Z",
    "isDeleted": false,
    "order": 6,
    "customId": "verification-code"
  },
  {
    "id": "a8b9c0d1-2e3f-4a5b-9c6d-7e8f9a0b1c2d",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Preferred Contact Method",
    "description": "How would you like us to reach you about this observation?",
    "type": "Radio",
    "required": false,
    "defaultValue": "",
    "validation": {},
    "options": [
      "Email",
      "Phone",
      "No preference"
    ],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-16T12:00:00.000Z",
    "isDeleted": false,
    "order": 7,
    "customId": "preferred-contact-method"
  },
  {
    "id": "c9d0e1f2-3a4b-4c5d-9e6f-7a8b9c0d1e2f",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Transportation Preference",
    "description": "How will the student get to and from school?",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "RadioCards",
      "cards": [
        {
          "value": "hisd-bus",
          "icon": "🚌",
          "title": "Yes, please provide HISD bus service",
          "description": "Student will ride the school bus to and from school",
          "subItems": [
            { "value": "bus-am-pm", "icon": "🔁", "title": "Morning & afternoon", "description": "Pick up and drop off both ways" },
            { "value": "bus-am", "icon": "🌅", "title": "Morning only", "description": "Pick up for arrival only" },
            { "value": "bus-pm", "icon": "🌆", "title": "Afternoon only", "description": "Drop off after dismissal only" }
          ]
        },
        {
          "value": "own-transport",
          "icon": "🚗",
          "title": "No, I'll provide my own transportation",
          "description": "Parent will drive or arrange other transportation"
        }
      ]
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-16T12:00:00.000Z",
    "isDeleted": false,
    "order": 8,
    "customId": "transportation-preference"
  },
  {
    "id": "d0e1f2a3-4b5c-4d6e-9f7a-8b9c0d1e2f3a",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Support Services Requested",
    "description": "Select all services the student should be enrolled in. You can choose more than one.",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "CheckboxCards",
      "cards": [
        {
          "value": "academic-support",
          "icon": "📚",
          "title": "Academic support",
          "description": "Tutoring and homework help",
          "subItems": [
            { "value": "academic-math", "icon": "➗", "title": "Math tutoring", "description": "Small-group or 1:1 math help" },
            { "value": "academic-reading", "icon": "📖", "title": "Reading support", "description": "Literacy and comprehension coaching" },
            { "value": "academic-esl", "icon": "🗣️", "title": "English language support", "description": "ESL enrichment sessions" }
          ]
        },
        {
          "value": "meals",
          "icon": "🍎",
          "title": "Meal program",
          "description": "Free or reduced-price meals",
          "subItems": [
            { "value": "meals-breakfast", "icon": "🥣", "title": "Breakfast", "description": "Morning meal before class" },
            { "value": "meals-lunch", "icon": "🥪", "title": "Lunch", "description": "Midday meal" }
          ]
        },
        {
          "value": "after-school",
          "icon": "🎒",
          "title": "After-school care",
          "description": "Supervised care until 6:00 PM"
        }
      ]
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-16T12:00:00.000Z",
    "isDeleted": false,
    "order": 9,
    "customId": "support-services-requested"
  },
  {
    "id": "e1f2a3b4-5c6d-4e7f-8a9b-0c1d2e3f4a5b",
    "sectionId": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
    "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "title": "Complete your previous contact information on file:",
    "description": "",
    "type": "CustomComponent",
    "required": false,
    "defaultValue": "",
    "component": {
      "type": "ContactVerification",
      "icon": "📞",
      "maskedEmailLabel": "Complete the email address we have on file:",
      "maskedPhoneLabel": "Complete the phone number we have on file:",
      "styles": {
        "bg": "#fdeef0",
        "border": "1px solid #e8a3ad",
        "borderRadius": "12px",
        "padding": "20px 24px"
      }
    },
    "validation": {},
    "options": [],
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-07-17T12:00:00.000Z",
    "isDeleted": false,
    "order": 10,
    "customId": "verify-previous-contact-on-file"
  }
]

export default {
  "form": {
    "id": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
    "tenantId": "00000000-0000-0000-0000-000000000002",
    "name": "Content Agnostic Classroom Observation Digital Tool",
    "description": "SY25-26 Observation &amp; Feedback",
    "source": "External",
    "version": "1.0",
    "anonymous": false,
    "status": "Published",
    "submissionCount": 0,
    "createdBy": "elvis@edwire.com",
    "createdDateTime": "2026-03-03T14:21:37.018+00:00",
    "lastModifiedBy": "matt@edwire.com",
    "lastModifiedDateTime": "2026-04-16T20:10:23.999+00:00",
    "isDeleted": false,
    "image": "https://upload.wikimedia.org/wikipedia/commons/8/8c/TEA_Logo.png"
  },
  "sections": [
    {
      "id": "3a1b79d0-be3f-4fff-bad4-e367cc06ae67",
      "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
      "title": "Rubric Legend",
      "description": "",
      "createdBy": "matt@edwire.com",
      "createdDateTime": "2026-03-30T16:20:13.101+00:00",
      "lastModifiedBy": "matt@edwire.com",
      "lastModifiedDateTime": "2026-03-30T16:20:37.318+00:00",
      "isDeleted": false,
      "order": 0,
      "customId": "rubric-legend"
    },
    {
      "id": "34e8ef12-f26b-4623-b2cc-6a0b8486558c",
      "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
      "title": "Learning Environment",
      "description": "Is the classroom environment structured to support efficient routines and student persistence to maximize instructional \ntime?",
      "createdBy": "matt@edwire.com",
      "createdDateTime": "2026-03-30T16:28:57.601+00:00",
      "lastModifiedBy": "matt@edwire.com",
      "lastModifiedDateTime": "2026-03-30T16:30:20.725+00:00",
      "isDeleted": false,
      "order": 1,
      "subHeading": "Aligned to T-TESS Domain 3",
      "customId": "learning-environment"
    },
    {
      "id": "e3126790-6563-460a-b310-af8a52569c9c",
      "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
      "title": "Instructional Delivery",
      "description": "Are all students learning accurate content through research and evidence-based instructional strategies?",
      "createdBy": "matt@edwire.com",
      "createdDateTime": "2026-03-30T16:32:45.719+00:00",
      "lastModifiedBy": "matt@edwire.com",
      "lastModifiedDateTime": "2026-03-30T16:32:52.774+00:00",
      "isDeleted": false,
      "order": 2,
      "subHeading": "Aligned to T-TESS Domain 2",
      "customId": "instructional-delivery"
    },
    {
      "id": "1233ed43-226b-4c7d-a12d-4d55fa6c5a92",
      "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
      "title": "Monitoring and Responding to Student Learning",
      "description": "Are all students able to demonstrate learning with teacher adjustments through formative assessments?",
      "createdBy": "matt@edwire.com",
      "createdDateTime": "2026-03-30T16:34:50.349+00:00",
      "lastModifiedBy": "matt@edwire.com",
      "lastModifiedDateTime": "2026-03-30T16:34:58.966+00:00",
      "isDeleted": false,
      "order": 3,
      "subHeading": "Aligned to T-TESS Domain 2",
      "customId": "monitoring-and-responding-to-student-learning"
    },
    {
      "id": "6639969f-fbf9-4ee3-b041-7075e9ae4086",
      "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
      "title": "Action Steps",
      "description": "",
      "createdBy": "matt@edwire.com",
      "createdDateTime": "2026-03-30T16:35:59.514+00:00",
      "isDeleted": false,
      "order": 4,
      "customId": "action-steps"
    },
    {
      "id": "e8530a0a-9e00-44aa-b0cd-24d17eeee2bf",
      "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
      "title": "Observation Notes",
      "description": "",
      "createdBy": "matt@edwire.com",
      "createdDateTime": "2026-03-30T16:38:25.458+00:00",
      "isDeleted": false,
      "order": 5,
      "customId": "observation-notes"
    },
    {
      "id": "f9d2b6a4-3c1e-4a7b-8e5d-0f1a2b3c4d5e",
      "formId": "713aac46-d717-4c3f-9d88-7a8f987f0f15",
      "title": "Observer Contact Information",
      "description": "How can we reach you about this observation?",
      "createdBy": "elvis@edwire.com",
      "createdDateTime": "2026-07-15T12:00:00.000+00:00",
      "isDeleted": false,
      "order": 6,
      "customId": "observer-contact-information"
    }
  ],
  "questions": groupBy(questions, 'sectionId')
}