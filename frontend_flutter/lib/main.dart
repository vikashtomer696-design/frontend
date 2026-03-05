import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'screens/workflow_builder/workflow_builder_screen.dart';

void main() {
  runApp(const ProviderScope(child: AutomationApp()));
}

class AutomationApp extends StatelessWidget {
  const AutomationApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Automation Platform',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.blue),
      home: const WorkflowBuilderScreen(),
    );
  }
}
