export type Language = 'ar' | 'fr';

export const strings: Record<string, Record<Language, string>> = {
  // ─── App Identity ───────────────────────────────────────────────────────────
  appName:           { ar: 'انشغالاتي', fr: 'Incheghalati' },
  appSubtitle:       { ar: 'منصة الإبلاغ عن المشاكل الحضرية', fr: 'Plateforme de signalement urbain' },
  ministry:          { ar: 'بلدية - ولاية', fr: 'Commune - Wilaya' },

  // ─── Roles ──────────────────────────────────────────────────────────────────
  citizen:           { ar: 'مواطن', fr: 'Citoyen' },
  teamLeader:        { ar: 'قائد الفريق', fr: "Chef d'équipe" },

  // ─── Auth ───────────────────────────────────────────────────────────────────
  login:             { ar: 'تسجيل الدخول', fr: 'Se connecter' },
  register:          { ar: 'إنشاء حساب', fr: 'Créer un compte' },
  email:             { ar: 'البريد الإلكتروني', fr: 'Adresse e-mail' },
  password:          { ar: 'كلمة المرور', fr: 'Mot de passe' },
  confirmPassword:   { ar: 'تأكيد كلمة المرور', fr: 'Confirmer le mot de passe' },
  fullName:          { ar: 'الاسم الكامل', fr: 'Nom complet' },
  phone:             { ar: 'رقم الهاتف', fr: 'Numéro de téléphone' },
  wilaya:            { ar: 'الولاية', fr: 'Wilaya' },
  forgotPassword:    { ar: 'نسيت كلمة المرور؟', fr: 'Mot de passe oublié ?' },
  noAccount:         { ar: 'ليس لديك حساب؟', fr: "Vous n'avez pas de compte ?" },
  hasAccount:        { ar: 'لديك حساب بالفعل؟', fr: 'Vous avez déjà un compte ?' },
  loginWelcome:      { ar: 'مرحباً بعودتك', fr: 'Bon retour' },
  registerWelcome:   { ar: 'انضم إلينا', fr: 'Rejoignez-nous' },
  registerSubtitle:  { ar: 'ساعد في تحسين مدينتك، بلاغ واحد في كل مرة.', fr: 'Aidez à améliorer votre ville, un signalement à la fois.' },

  // ─── Navigation ─────────────────────────────────────────────────────────────
  myReports:         { ar: 'بلاغاتي', fr: 'Mes signalements' },
  newReport:         { ar: 'بلاغ جديد', fr: 'Nouveau signalement' },
  submitReport:      { ar: 'إرسال البلاغ', fr: 'Soumettre un signalement' },
  assignedTasks:     { ar: 'المهام المُسنَدة', fr: 'Tâches assignées' },
  profile:           { ar: 'الملف الشخصي', fr: 'Profil' },
  myTasks:           { ar: 'مهامي', fr: 'Mes tâches' },

  // ─── Status Labels ──────────────────────────────────────────────────────────
  statusPending:     { ar: 'معلق', fr: 'En attente' },
  statusAssigned:    { ar: 'مُسنَد', fr: 'Assigné' },
  statusInProgress:  { ar: 'قيد التنفيذ', fr: 'En cours' },
  statusCompleted:   { ar: 'مكتمل', fr: 'Terminé' },
  statusApproved:    { ar: 'مُعتمَد', fr: 'Approuvé' },

  // ─── Priority Labels ───────────────────────────────────────────────────────
  priorityLow:       { ar: 'منخفض', fr: 'Faible' },
  priorityMedium:    { ar: 'متوسط', fr: 'Moyen' },
  priorityHigh:      { ar: 'عالي', fr: 'Élevé' },

  // ─── Empty States ───────────────────────────────────────────────────────────
  noReports:         { ar: 'لا توجد بلاغات بعد', fr: 'Aucun signalement pour l\'instant' },
  noReportsSubtext:  { ar: 'اضغط على الزر أدناه لإرسال أول بلاغ لك.', fr: 'Appuyez sur le bouton ci-dessous pour soumettre votre premier signalement.' },
  noTasks:           { ar: 'لا توجد مهام مُسنَدة', fr: 'Aucune tâche assignée' },
  noTasksSubtext:    { ar: 'لا توجد مهام مُسنَدة لك حالياً. عمل ممتاز!', fr: 'Aucune tâche ne vous est assignée pour le moment. Excellent travail !' },
  offline:           { ar: 'أنت غير متصل بالإنترنت', fr: 'Vous êtes hors ligne' },
  offlineSubtext:    { ar: 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى.', fr: 'Vérifiez votre connexion Internet et réessayez.' },
  errorTitle:        { ar: 'حدث خطأ', fr: 'Une erreur est survenue' },
  errorSubtext:      { ar: 'يرجى المحاولة مرة أخرى لاحقاً.', fr: 'Veuillez réessayer plus tard.' },

  // ─── Report Form ────────────────────────────────────────────────────────────
  reportInfo:        { ar: 'معلومات البلاغ', fr: 'Informations' },
  title:             { ar: 'العنوان', fr: 'Titre' },
  description:       { ar: 'الوصف', fr: 'Description' },
  photos:            { ar: 'الصور', fr: 'Photos' },
  location:          { ar: 'الموقع الجغرافي', fr: 'Localisation' },
  useMyLocation:     { ar: 'تحديد موقعي', fr: 'Utiliser ma position' },
  evidencePhoto:     { ar: 'صورة الدليل', fr: 'Photo de preuve' },
  camera:            { ar: 'الكاميرا', fr: 'Caméra' },
  gallery:           { ar: 'المعرض', fr: 'Galerie' },
  reportDetails:     { ar: 'تفاصيل البلاغ', fr: 'Détails du signalement' },
  locationTagged:    { ar: 'تم تحديد الموقع', fr: 'Localisation marquée' },
  tagLocation:       { ar: 'تحديد الموقع الحالي', fr: 'Marquer la position actuelle' },
  requiredField:     { ar: 'مطلوب للتحقق الميداني', fr: 'Requis pour la vérification sur le terrain' },

  // ─── Report Details ─────────────────────────────────────────────────────────
  progressTimeline:  { ar: 'مسار التقدم', fr: 'Chronologie' },
  reportCreated:     { ar: 'تم الإرسال', fr: 'Signalement créé' },
  receivedByServices:{ ar: 'تم الاستلام من الخدمات الحضرية', fr: 'Reçu par les services urbains' },
  underInvestigation:{ ar: 'قيد المراجعة', fr: 'En examen' },
  techTeamAssigned:  { ar: 'تم تعيين الفريق التقني', fr: 'Équipe technique assignée' },
  workInProgress:    { ar: 'قيد التنفيذ', fr: 'Travaux en cours' },
  maintenanceOnSite: { ar: 'فريق الصيانة في الموقع', fr: 'Équipe de maintenance sur site' },
  resolved:          { ar: 'تم الحل', fr: 'Résolu' },
  issueFixed:        { ar: 'تم إصلاح المشكلة بنجاح', fr: 'Problème résolu avec succès' },
  approved:          { ar: 'مُعتمَد', fr: 'Approuvé' },
  approvedByAdmin:   { ar: 'تمت الموافقة من الإدارة', fr: "Approuvé par l'administration" },
  reportId:          { ar: 'رقم البلاغ', fr: 'ID du signalement' },
  locationLabel:     { ar: 'الموقع', fr: 'Localisation' },

  // ─── Team Leader Actions ────────────────────────────────────────────────────
  startWork:         { ar: 'بدء العمل', fr: 'Commencer le travail' },
  markComplete:      { ar: 'تعليم كمكتمل', fr: 'Marquer comme terminé' },
  uploadProof:       { ar: 'رفع إثبات الإنجاز', fr: 'Téléverser une preuve' },
  approveWork:       { ar: 'اعتماد العمل', fr: 'Approuver le travail' },
  confirmCompletion: { ar: 'تأكيد الإنجاز', fr: 'Confirmer la réalisation' },
  completionNotes:   { ar: 'ملاحظات الإنجاز', fr: 'Notes de réalisation' },
  proofOfCompletion: { ar: 'إثبات الإنجاز', fr: 'Preuve de réalisation' },
  proofHelper:       { ar: 'قم بتصوير أو رفع صور لإثبات حل المشكلة.', fr: 'Prenez ou téléchargez des photos pour prouver la résolution du problème.' },
  uploading:         { ar: 'جاري الرفع...', fr: 'Téléchargement en cours...' },
  workActions:       { ar: 'إجراءات العمل', fr: 'Actions de travail' },
  assignedToYou:     { ar: 'مُسنَد إليك', fr: 'Assigné à vous' },
  addImage:          { ar: 'إضافة صورة', fr: 'Ajouter une photo' },
  addImageAfter:     { ar: 'إضافة صورة لاحقاً', fr: 'Ajouter une photo après' },
  openGoogleMaps:    { ar: 'فتح في خرائط جوجل', fr: 'Ouvrir dans Google Maps' },
  viewOnMap:         { ar: 'عرض على الخريطة', fr: 'Voir sur la carte' },
  markAsComplete:    { ar: 'تعليم كمكتمل', fr: 'Marquer comme terminé' },
  completeReport:    { ar: 'إتمام البلاغ', fr: 'Terminer le signalement' },
  addCompletionPhoto:{ ar: 'إضافة صورة إنجاز', fr: "Ajouter une photo d'achèvement" },
  imageAdded:        { ar: 'تمت إضافة الصورة', fr: 'Photo ajoutée' },
  imageAddedSuccess: { ar: 'تمت إضافة الصورة بنجاح.', fr: 'La photo a été ajoutée avec succès.' },
  additionalPhotos:  { ar: 'صور إضافية', fr: 'Photos supplémentaires' },

  // ─── Profile ────────────────────────────────────────────────────────────────
  logout:            { ar: 'تسجيل الخروج', fr: 'Déconnexion' },
  logoutConfirm:     { ar: 'هل أنت متأكد من تسجيل الخروج؟', fr: 'Êtes-vous sûr de vouloir vous déconnecter ?' },
  cancel:            { ar: 'إلغاء', fr: 'Annuler' },
  appLanguage:       { ar: 'لغة التطبيق', fr: 'Langue' },
  notifications:     { ar: 'الإشعارات', fr: 'Notifications' },
  testNotification:  { ar: 'إشعار تجريبي', fr: 'Notification de test' },
  helpCenter:        { ar: 'مركز المساعدة', fr: "Centre d'aide" },
  termsPrivacy:      { ar: 'الشروط والخصوصية', fr: 'Conditions et confidentialité' },
  appSettings:       { ar: 'إعدادات التطبيق', fr: "Paramètres de l'application" },
  version:           { ar: 'الجزائر الحضرية ن١.٢.٠', fr: 'Algérie Urbaine v1.2.0' },
  totalReports:      { ar: 'البلاغات', fr: 'Signalements' },
  resolvedCount:     { ar: 'تم الحل', fr: 'Résolus' },
  pendingCount:      { ar: 'معلق', fr: 'En attente' },
  on:                { ar: 'مفعّل', fr: 'Activé' },

  // ─── Filter Tabs ────────────────────────────────────────────────────────────
  all:               { ar: 'الكل', fr: 'Tout' },
  filterPending:     { ar: 'في الانتظار', fr: 'En attente' },
  filterInProgress:  { ar: 'قيد التنفيذ', fr: 'En cours' },

  // ─── General ────────────────────────────────────────────────────────────────
  submit:            { ar: 'إرسال', fr: 'Envoyer' },
  back:              { ar: 'العودة', fr: 'Retour' },
  done:              { ar: 'تم', fr: 'Terminé' },
  success:           { ar: 'نجاح', fr: 'Succès' },
  error:             { ar: 'خطأ', fr: 'Erreur' },
  loading:           { ar: 'جاري التحميل...', fr: 'Chargement...' },
  retry:             { ar: 'إعادة المحاولة', fr: 'Réessayer' },
  sendingReport:     { ar: 'جاري إرسال البلاغ', fr: "Envoi du signalement" },
  optimizingMedia:   { ar: 'جاري تحسين ورفع الوسائط...', fr: 'Optimisation et envoi des médias...' },
  reportSubmitted:   { ar: 'تم إرسال البلاغ', fr: 'Signalement envoyé' },
  thankYou:          { ar: 'شكراً لمساهمتك في تحسين مدينتنا.', fr: 'Merci pour votre contribution à l\'amélioration de notre ville.' },
  photoRequired:     { ar: 'الصورة مطلوبة', fr: 'Photo requise' },
  pleaseAttachPhoto: { ar: 'يرجى إرفاق صورة للمشكلة.', fr: 'Veuillez joindre une photo du problème.' },
  locationRequired:  { ar: 'الموقع مطلوب', fr: 'Localisation requise' },
  pleaseTagLocation: { ar: 'يرجى تحديد الموقع.', fr: 'Veuillez marquer la localisation.' },
  titleRequired:     { ar: 'العنوان مطلوب', fr: 'Le titre est requis' },
  descriptionRequired: { ar: 'الوصف مطلوب', fr: 'La description est requise' },
  descriptionMin:    { ar: 'يرجى تقديم المزيد من التفاصيل', fr: 'Veuillez fournir plus de détails' },
  completeFields:    { ar: 'يرجى إكمال جميع الحقول المطلوبة.', fr: 'Veuillez remplir tous les champs requis.' },
  accountCreated:    { ar: 'تم إنشاء الحساب! يمكنك الآن تسجيل الدخول.', fr: 'Compte créé ! Vous pouvez maintenant vous connecter.' },
  imagesRequired:    { ar: 'الصور مطلوبة', fr: 'Photos requises' },
  pleaseUploadImage: { ar: 'يرجى رفع صورة واحدة على الأقل لإثبات الإنجاز.', fr: "Veuillez télécharger au moins une photo pour prouver l'achèvement." },
  reportCompleted:   { ar: 'تم تعليم البلاغ كمكتمل!', fr: 'Signalement marqué comme terminé !' },
  goodMorning:       { ar: 'صباح الخير', fr: 'Bonjour' },
  teamLeaderMode:    { ar: 'وضع قائد الفريق', fr: "Mode chef d'équipe" },
  locationVerified:  { ar: 'تم التحقق من الموقع', fr: 'Localisation vérifiée' },
  titlePlaceholder:  { ar: 'العنوان (مثال: عمود إنارة مكسور)', fr: 'Titre (ex : lampadaire cassé)' },
  descPlaceholder:   { ar: 'أخبرنا بما يحدث...', fr: 'Décrivez la situation...' },
  completionImages:  { ar: 'صور الإنجاز', fr: "Photos d'achèvement" },
  assigned:          { ar: 'مُسنَد', fr: 'Assigné' },
  notesPlaceholder:  { ar: 'أضف تفاصيل عن الإصلاح...', fr: 'Ajoutez des détails sur la réparation...' },
  emailPlaceholder:  { ar: 'name@example.com', fr: 'nom@example.com' },
  passwordPlaceholder: { ar: '••••••••', fr: '••••••••' },
  passwordMin:       { ar: '٦ أحرف على الأقل', fr: 'Au moins 6 caractères' },
  passwordMismatch:  { ar: 'كلمتا المرور غير متطابقتين', fr: 'Les mots de passe ne correspondent pas' },
  invalidEmail:      { ar: 'بريد إلكتروني غير صالح', fr: 'E-mail invalide' },
};

/**
 * Translate a key into the current language
 */
export const t = (key: string, lang: Language): string => {
  const entry = strings[key];
  if (!entry) {
    console.warn(`Missing translation key: ${key}`);
    return key;
  }
  return entry[lang] || entry['fr'] || key;
};

/**
 * Get status label in the current language
 */
export const getStatusLabel = (status: string | number, lang: Language): string => {
  switch (status) {
    case 'pending': case 0: return t('statusPending', lang);
    case 'assigned': return t('statusAssigned', lang);
    case 'in_progress': case 1: return t('statusInProgress', lang);
    case 'completed': case 2: return t('statusCompleted', lang);
    case 'approved': return t('statusApproved', lang);
    default: return '—';
  }
};

/**
 * Get priority label in the current language
 */
export const getPriorityLabel = (priority: number, lang: Language): string => {
  switch (priority) {
    case 1: return t('priorityLow', lang);
    case 2: return t('priorityMedium', lang);
    case 3: return t('priorityHigh', lang);
    default: return '—';
  }
};
