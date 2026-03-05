import 'package:flutter/material.dart';
import 'features/workflows/presentation/workflow_list_page.dart';

void main() {
  runApp(const AutomationApp());
}

class AutomationApp extends StatelessWidget {
  const AutomationApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Automation Platform',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.indigo),
      home: const WorkflowListPage(),
    );
  }
}
