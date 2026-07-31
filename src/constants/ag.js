// Assignment Groups. `value` is the ServiceNow sys_id written to the hidden input;
// `name` is the human-readable label written to the visible input.
//
// KNOWN DEAD, as of the 2026-07-31 sync against sys_user_group. All three are
// inactive in ServiceNow with no live successor, so the shortcuts below still
// fire but route nowhere useful. Left in place deliberately, pending someone
// tracking down the current owners:
//   msca   ` m     MSCA User Support -- inactive
//   google ` 1 g   renamed to 'G Suite User Support', deactivated 2021-09-10
//   spam   ` 1 r   renamed to 'UW-IT Reported Phishing', then deactivated
// The `name` values here are the pre-rename labels; they are what the form will
// show until the entries are repointed.
export default {
  csrm: { name: 'CSCRM', value: '90a94c2e6fb0250079d3fd16ad3ee412' },
  info: { name: 'UW-IT Service Desk', value: '2a376bde6fcb110079d3fd16ad3ee431' },
  msca: { name: 'MSCA User Support', value: 'bb0356e26f26110054aafd16ad3ee482' },
  netops: { name: 'Network Operations', value: 'd774f5e76fdf110079d3fd16ad3ee491' },
  canvas: { name: 'Learning Tech Canvas', value: '1854c1a06f1ca100ab448bec5d3ee4ef' },
  catalyst: { name: 'Learning Tech Catalyst', value: '6c54c1a06f1ca100ab448bec5d3ee4f2' },
  iam: { name: 'Identity and Access Management', value: 'e3a94c2e6fb0250079d3fd16ad3ee437' },
  web: { name: 'UW Web Hosting', value: '734396e26f26110054aafd16ad3ee44f' },
  stdsvr: { name: 'Computing Infrastructure Incoming', value: '9fa94c2e6fb0250079d3fd16ad3ee433' },
  mailman: { name: 'Email Lists (Mailman)', value: '00053f716fc8610079d3fd16ad3ee4a9' },
  edw: { name: 'EDW - Incoming', value: '8ae2d2e26f26110054aafd16ad3ee476' },
  spam: { name: 'UW-IT Reported Spam', value: '525a42c46f07224090eaa2054b3ee433' },
  connect: { name: 'UW Connect Support - Service Management', value: '79cfa0a86f2a110054aafd16ad3ee4fc' },
  mws: { name: 'MWS Tier 2', value: '524396e26f26110054aafd16ad3ee441' },
  zoom: { name: 'Web Conference Consulting', value: '63d9b9e96ff9a50090ead2054b3ee4ff' },
  uwitacm: { name: 'UW-IT Service Center Access Management', value: 'db376bde6fcb110079d3fd16ad3ee444' },
  software: { name: 'Software Licensing', value: '801356e26f26110054aafd16ad3ee487' },
  google: { name: 'Google Collaborative Applications (Google Apps)', value: 'b20356e26f26110054aafd16ad3ee474' },
  escalation: { name: 'UW-IT Service Desk Escalation', value: '43376bde6fcb110079d3fd16ad3ee436' },
  myuw: { name: 'Enterprise Portal (MyUW)', value: '8c1356e26f26110054aafd16ad3ee484' },
  cte: { name: 'Classroom Facilities Services', value: '56b292e26f26110054aafd16ad3ee4bc' },
  hyak: { name: 'High-Performance Supercomputing Research Cluster (Hyak)', value: '0d0356e26f26110054aafd16ad3ee460' },
  trumba: { name: 'Campus Event Calendar', value: '54053f716fc8610079d3fd16ad3ee4ac' },
  officedir: { name: 'CC Office Directory', value: '4da94c2e6fb0250079d3fd16ad3ee417' },
  cert: { name: 'Certificate Services', value: 'ae0356e26f26110054aafd16ad3ee471' },
  teleconf: { name: 'Teleconferencing', value: '030356e26f26110054aafd16ad3ee477' },
  procurement: { name: 'Procurement', value: '90769ae26f26110054aafd16ad3ee467' },
  esignatures: { name: 'eSignatures Management', value: '6fa14c5b6f573e881b9f77131c3ee407' },
  portblock: { name: 'Network Port Block', value: '8cf4228a6f2a070030b1073aea3ee41c' },
  datacenter: { name: 'Data Center Services', value: 'a13396e26f26110054aafd16ad3ee40f' },
  sis: { name: 'SIS Support', value: '70c94c2e6fb0250079d3fd16ad3ee48c' }
}
