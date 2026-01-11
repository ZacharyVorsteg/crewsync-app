export type Language = 'en' | 'es' | 'pt' | 'zh'

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',

    // Mobile App
    'mobile.title': 'CrewSync',
    'mobile.today': "Today's Assignments",
    'mobile.noAssignments': 'No assignments today',
    'mobile.clockIn': 'Clock In',
    'mobile.clockOut': 'Clock Out',
    'mobile.clockedIn': 'Clocked In',
    'mobile.checklist': 'Cleaning Checklist',
    'mobile.tasksCompleted': '{completed} of {total} tasks completed',
    'mobile.gpsVerified': 'GPS Verified',
    'mobile.offSite': 'Off-site',
    'mobile.started': 'Started',

    // Schedule
    'schedule.title': 'Schedule',
    'schedule.addShift': 'Add Shift',
    'schedule.noShifts': 'No shifts scheduled',
    'schedule.completed': 'Completed',
    'schedule.scheduled': 'Scheduled',
    'schedule.missed': 'Missed',
    'schedule.inProgress': 'In Progress',

    // Sites
    'sites.title': 'Sites',
    'sites.addSite': 'Add Site',
    'sites.noSites': 'No sites yet',
    'sites.active': 'Active',
    'sites.inactive': 'Inactive',

    // Crew
    'crew.title': 'Crew Members',
    'crew.addMember': 'Add Crew Member',
    'crew.noMembers': 'No crew members yet',

    // Time
    'time.title': 'Time Tracking',
    'time.totalHours': 'Total Hours',
    'time.export': 'Export to CSV',

    // Alerts
    'alerts.title': 'Alerts',
    'alerts.noAlerts': 'No active alerts',
    'alerts.noShow': 'No Show',
    'alerts.lateArrival': 'Late Arrival',
    'alerts.offSite': 'Off-Site Clock-in',
  },

  es: {
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.search': 'Buscar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Exito',

    // Mobile App
    'mobile.title': 'CrewSync',
    'mobile.today': 'Asignaciones de Hoy',
    'mobile.noAssignments': 'Sin asignaciones hoy',
    'mobile.clockIn': 'Registrar Entrada',
    'mobile.clockOut': 'Registrar Salida',
    'mobile.clockedIn': 'Entrada Registrada',
    'mobile.checklist': 'Lista de Limpieza',
    'mobile.tasksCompleted': '{completed} de {total} tareas completadas',
    'mobile.gpsVerified': 'GPS Verificado',
    'mobile.offSite': 'Fuera del sitio',
    'mobile.started': 'Iniciado',

    // Schedule
    'schedule.title': 'Horario',
    'schedule.addShift': 'Agregar Turno',
    'schedule.noShifts': 'No hay turnos programados',
    'schedule.completed': 'Completado',
    'schedule.scheduled': 'Programado',
    'schedule.missed': 'Perdido',
    'schedule.inProgress': 'En Progreso',

    // Sites
    'sites.title': 'Sitios',
    'sites.addSite': 'Agregar Sitio',
    'sites.noSites': 'Sin sitios todavia',
    'sites.active': 'Activo',
    'sites.inactive': 'Inactivo',

    // Crew
    'crew.title': 'Miembros del Equipo',
    'crew.addMember': 'Agregar Miembro',
    'crew.noMembers': 'Sin miembros todavia',

    // Time
    'time.title': 'Control de Tiempo',
    'time.totalHours': 'Horas Totales',
    'time.export': 'Exportar a CSV',

    // Alerts
    'alerts.title': 'Alertas',
    'alerts.noAlerts': 'Sin alertas activas',
    'alerts.noShow': 'No Se Presento',
    'alerts.lateArrival': 'Llegada Tarde',
    'alerts.offSite': 'Entrada Fuera del Sitio',
  },

  pt: {
    // Common
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Excluir',
    'common.edit': 'Editar',
    'common.add': 'Adicionar',
    'common.search': 'Pesquisar',
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',

    // Mobile App
    'mobile.title': 'CrewSync',
    'mobile.today': 'Tarefas de Hoje',
    'mobile.noAssignments': 'Sem tarefas hoje',
    'mobile.clockIn': 'Registrar Entrada',
    'mobile.clockOut': 'Registrar Saida',
    'mobile.clockedIn': 'Entrada Registrada',
    'mobile.checklist': 'Lista de Limpeza',
    'mobile.tasksCompleted': '{completed} de {total} tarefas concluidas',
    'mobile.gpsVerified': 'GPS Verificado',
    'mobile.offSite': 'Fora do local',
    'mobile.started': 'Iniciado',

    // Schedule
    'schedule.title': 'Agenda',
    'schedule.addShift': 'Adicionar Turno',
    'schedule.noShifts': 'Nenhum turno agendado',
    'schedule.completed': 'Concluido',
    'schedule.scheduled': 'Agendado',
    'schedule.missed': 'Perdido',
    'schedule.inProgress': 'Em Andamento',

    // Sites
    'sites.title': 'Locais',
    'sites.addSite': 'Adicionar Local',
    'sites.noSites': 'Sem locais ainda',
    'sites.active': 'Ativo',
    'sites.inactive': 'Inativo',

    // Crew
    'crew.title': 'Membros da Equipe',
    'crew.addMember': 'Adicionar Membro',
    'crew.noMembers': 'Sem membros ainda',

    // Time
    'time.title': 'Controle de Tempo',
    'time.totalHours': 'Total de Horas',
    'time.export': 'Exportar para CSV',

    // Alerts
    'alerts.title': 'Alertas',
    'alerts.noAlerts': 'Sem alertas ativos',
    'alerts.noShow': 'Nao Compareceu',
    'alerts.lateArrival': 'Chegada Atrasada',
    'alerts.offSite': 'Entrada Fora do Local',
  },

  zh: {
    // Common
    'common.save': '保存',
    'common.cancel': '取消',
    'common.delete': '删除',
    'common.edit': '编辑',
    'common.add': '添加',
    'common.search': '搜索',
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',

    // Mobile App
    'mobile.title': 'CrewSync',
    'mobile.today': '今日任务',
    'mobile.noAssignments': '今天没有任务',
    'mobile.clockIn': '上班打卡',
    'mobile.clockOut': '下班打卡',
    'mobile.clockedIn': '已打卡上班',
    'mobile.checklist': '清洁清单',
    'mobile.tasksCompleted': '已完成 {completed}/{total} 项任务',
    'mobile.gpsVerified': 'GPS已验证',
    'mobile.offSite': '非现场',
    'mobile.started': '开始时间',

    // Schedule
    'schedule.title': '日程',
    'schedule.addShift': '添加班次',
    'schedule.noShifts': '没有排班',
    'schedule.completed': '已完成',
    'schedule.scheduled': '已排班',
    'schedule.missed': '缺勤',
    'schedule.inProgress': '进行中',

    // Sites
    'sites.title': '工作地点',
    'sites.addSite': '添加地点',
    'sites.noSites': '暂无地点',
    'sites.active': '活跃',
    'sites.inactive': '非活跃',

    // Crew
    'crew.title': '团队成员',
    'crew.addMember': '添加成员',
    'crew.noMembers': '暂无成员',

    // Time
    'time.title': '时间追踪',
    'time.totalHours': '总工时',
    'time.export': '导出CSV',

    // Alerts
    'alerts.title': '警报',
    'alerts.noAlerts': '没有活跃警报',
    'alerts.noShow': '缺勤',
    'alerts.lateArrival': '迟到',
    'alerts.offSite': '非现场打卡',
  },
}

export function t(key: string, lang: Language = 'en', params?: Record<string, string | number>): string {
  let text = translations[lang]?.[key] || translations.en[key] || key

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, String(value))
    })
  }

  return text
}
