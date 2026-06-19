def gretting():
    print("Hi, there.")


def calculate_pi() -> float:
    """
    Calculate pi to the 5th decimal place (3.14159) using the
    Leibniz formula: pi/4 = 1 - 1/3 + 1/5 - 1/7 + ...
    The series runs until the result is accurate to 5 decimal places.
    """
    pi_estimate = 0.0
    denominator = 1
    sign = 1

    for _ in range(1_000_000):
        pi_estimate += sign * (1.0 / denominator)
        denominator += 2
        sign *= -1

    return round(pi_estimate * 4, 5)