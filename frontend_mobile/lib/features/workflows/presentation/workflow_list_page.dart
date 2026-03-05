import 'package:flutter/material.dart';

class WorkflowListPage extends StatelessWidget {
  const WorkflowListPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Workflows')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: ListTile(
              title: Text('Welcome to automation platform'),
              subtitle: Text('Mobile-first Flutter shell for workflow builder and executions')
            )
          )
        ]
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        icon: const Icon(Icons.add),
        label: const Text('New Workflow')
      )
    );
  }
}
