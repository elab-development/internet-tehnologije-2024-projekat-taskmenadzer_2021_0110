<!DOCTYPE html>
<html>
<head>
    <title>Lista zadataka</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 10px;
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>Lista zadataka</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Naslov</th>
                <th>Status</th>
                <th>Rok</th>
                <th>Kategorija</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tasks as $task)
                <tr>
                    <td>{{ $task->id }}</td>
                    <td>{{ $task->title }}</td>
                    <td>{{ $task->status }}</td>
                    <td>{{ $task->deadline }}</td>
                    <td>{{ $task->category->name ?? 'N/A' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
