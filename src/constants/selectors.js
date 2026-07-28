// CSS selectors for the UW Connect (ServiceNow) form fields and pages.
// Dots inside ServiceNow element ids are escaped so they are matched literally.
export default {
  formfields: {
    ci: {
      displayed: '#sys_display\\.u_simple_requests\\.cmdb_ci',
      hidden: '#u_simple_requests\\.cmdb_ci'
    },
    ag: {
      displayed: '#sys_display\\.u_simple_requests\\.assignment_group',
      hidden: '#u_simple_requests\\.assignment_group'
    },
    sector: '#u_simple_requests\\.u_sector',
    disablenotif: '#u_simple_requests\\.u_disable_notifications',
    template: {
      hidden: '#u_simple_requests\\.u_template',
      displayed: '#sys_display\\.u_simple_requests\\.u_template'
    }
  },
  taskpage: {
    updatebutton: '#sysverb_update',
    resolvebutton: '#resolve_request'
  },
  navpage: {
    taskiframe: '#gsft_main',
    nextreq: '#dropzone0 div:first-child td.list_div_cell tbody.list2_body tr:last-child td.vt a.linked.formlink',
    homelink: 'a.navbar-brand'
  }
}
