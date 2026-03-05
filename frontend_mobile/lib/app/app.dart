import 'package:flutter/material.dart';
import '../core/theme/app_theme.dart';
import '../features/workflows/presentation/workflow_list_page.dart';

class AutomationApp extends StatelessWidget {
  const AutomationApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Automation Platform',
      theme: buildAppTheme(),
      home: const WorkflowListPage()
    );
  }
}
