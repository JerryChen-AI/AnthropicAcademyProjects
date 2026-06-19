import unittest
from main import calculate_pi


class TestCalculatePi(unittest.TestCase):

    def test_returns_float(self):
        """Test that calculate_pi() returns a float."""
        result = calculate_pi()
        self.assertIsInstance(result, float)

    def test_pi_to_5th_digit(self):
        """Test that calculate_pi() returns pi accurate to 5 decimal places."""
        result = calculate_pi()
        self.assertEqual(result, 3.14159)

    def test_pi_is_positive(self):
        """Test that calculate_pi() returns a positive value."""
        result = calculate_pi()
        self.assertGreater(result, 0)

    def test_pi_is_within_expected_range(self):
        """Test that calculate_pi() is within a reasonable range of pi."""
        result = calculate_pi()
        self.assertGreaterEqual(result, 3.14)
        self.assertLessEqual(result, 3.15)


if __name__ == "__main__":
    unittest.main()
