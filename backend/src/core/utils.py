from typing import get_type_hints


def get_func_instance_arg(func, instance_type):
    """
    Получение аргумента функции по его сигнатурному типу
    """
    args_types = get_type_hints(func)

    current_type, arg_name = None, None
    for arg in args_types:
        arg_type = args_types[arg]
        if issubclass(arg_type, instance_type):
            current_type = arg_type
            arg_name = arg

    return current_type, arg_name

