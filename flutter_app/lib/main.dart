import 'package:flutter/material.dart';

void main() {
  runApp(const AutomationMobileApp());
}

class AutomationMobileApp extends StatelessWidget {
  const AutomationMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Automation Platform',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blueAccent),
        useMaterial3: true,
      ),
      home: const WorkflowBuilderPage(),
    );
  }
}

class WorkflowBuilderPage extends StatelessWidget {
  const WorkflowBuilderPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Workflow Builder')),
      body: LayoutBuilder(
        builder: (context, constraints) {
          final isCompact = constraints.maxWidth < 600;
          return isCompact
              ? const _MobileWorkflowLayout()
              : const _TabletWorkflowLayout();
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.add),
        label: const Text('Add Node'),
      ),
    );
  }
}

class _MobileWorkflowLayout extends StatelessWidget {
  const _MobileWorkflowLayout();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        _WorkflowNodeCard(title: 'Webhook Trigger', subtitle: 'Start the flow externally'),
        _WorkflowNodeCard(title: 'HTTP Request', subtitle: 'Send API request'),
        _WorkflowNodeCard(title: 'If Condition', subtitle: 'Branch workflow logic'),
      ],
    );
  }
}

class _TabletWorkflowLayout extends StatelessWidget {
  const _TabletWorkflowLayout();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: const [
        Expanded(child: _MobileWorkflowLayout()),
        VerticalDivider(width: 1),
        Expanded(
          child: Center(
            child: Text('Node configuration panel'),
          ),
        ),
      ],
    );
  }
}

class _WorkflowNodeCard extends StatelessWidget {
  const _WorkflowNodeCard({required this.title, required this.subtitle});

  final String title;
  final String subtitle;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        title: Text(title),
        subtitle: Text(subtitle),
        trailing: const Icon(Icons.drag_indicator),
      ),
    );
  }
}
