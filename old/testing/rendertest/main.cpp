#include <iostream>
#include <vector>
#include <cmath>
#include <algorithm>

using namespace std;

// Define a 3D vector
struct Vector3 {
    double x, y, z;

    Vector3(double x = 0, double y = 0, double z = 0) : x(x), y(y), z(z) {}

    // Add two vectors
    Vector3 operator+(const Vector3& v) const {
        return Vector3(x + v.x, y + v.y, z + v.z);
    }

    // Subtract two vectors
    Vector3 operator-(const Vector3& v) const {
        return Vector3(x - v.x, y - v.y, z - v.z);
    }

    // Scale a vector by a scalar value
    Vector3 operator*(double s) const {
        return Vector3(x * s, y * s, z * s);
    }

    // Compute the dot product of two vectors
    double dot(const Vector3& v) const {
        return x * v.x + y * v.y + z * v.z;
    }

    // Compute the cross product of two vectors
    Vector3 cross(const Vector3& v) const {
        return Vector3(y * v.z - z * v.y, z * v.x - x * v.z, x * v.y - y * v.x);
    }

    // Compute the magnitude of a vector
    double magnitude() const {
        return sqrt(x * x + y * y + z * z);
    }

    // Normalize a vector
    Vector3 normalize() const {
        double mag = magnitude();
        return Vector3(x / mag, y / mag, z / mag);
    }
};

// Define a 3D point
typedef Vector3 Point3;

// Define a 3D line segment
struct Line3 {
    Point3 start, end;

    Line3(const Point3& start = Point3(), const Point3& end = Point3()) : start(start), end(end) {}
};

// Define a 3D triangle
struct Triangle3 {
    Point3 v1, v2, v3;

    Triangle3(const Point3& v1 = Point3(), const Point3& v2 = Point3(), const Point3& v3 = Point3()) : v1(v1), v2(v2), v3(v3) {}
};

// Define a 4x4 matrix
struct Matrix4 {
    double m[4][4];

    Matrix4() {
        memset(m, 0, sizeof(m));
    }

    // Get a row of the matrix
    double* operator[](int i) {
        return m[i];
    }

    // Get a const row of the matrix
    const double* operator[](int i) const {
        return m[i];
    }

    // Multiply two matrices
    Matrix4 operator*(const Matrix4& a) const {
        Matrix4 result;
        for (int i = 0; i < 4; ++i) {
            for (int j = 0; j < 4; ++j) {
                for (int k = 0; k < 4; ++k) {
                    result[i][j] += m[i][k] * a[k][j];
                }
            }
        }
        return result;
    }

    // Transform a point by the matrix
    Point3 operator*(const Point3& p) const {
        double x = p.x * m[0][0] + p.y * m[1][0] + p.z * m[2][0] + m[3][0];
        double y = p.x * m[0][1] + p.y * m[1][1] + p.z * m[2][1] + m[3][1];
        double z = p.x * m[0][2] + p.y * m[1][2] + p.z * m[2][2] + m[3][2];
        double w = p.x * m[0][3] + p.y * m[1][3] + p.z * m[2][3] + m[3][3];
        return Point3(x / w, y / w, z / w);
    }

// Transform a line segment by the matrix
Line3 operator*(const Line3& l) const {
    return Line3((*this) * l.start, (*this) * l.end);
}

// Transform a triangle by the matrix
Triangle3 operator*(const Triangle3& t) const {
    return Triangle3((*this) * t.v1, (*this) * t.v2, (*this) * t.v3);
}

// Create a translation matrix
static Matrix4 translation(double x, double y, double z) {
    Matrix4 result;
    result[0][3] = x;
    result[1][3] = y;
    result[2][3] = z;
    result[3][3] = 1;
    return result;
}

// Create a scaling matrix
static Matrix4 scaling(double x, double y, double z) {
    Matrix4 result;
    result[0][0] = x;
    result[1][1] = y;
    result[2][2] = z;
    result[3][3] = 1;
    return result;
}

// Create a rotation matrix around the X axis
static Matrix4 rotationX(double angle) {
    double c = cos(angle);
    double s = sin(angle);
    Matrix4 result;
    result[1][1] = c;
    result[1][2] = -s;
    result[2][1] = s;
    result[2][2] = c;
    result[0][0] = result[3][3] = 1;
    return result;
}

// Create a rotation matrix around the Y axis
static Matrix4 rotationY(double angle) {
    double c = cos(angle);
    double s = sin(angle);
    Matrix4 result;
    result[0][0] = c;
    result[0][2] = s;
    result[2][0] = -s;
    result[2][2] = c;
    result[1][1] = result[3][3] = 1;
    return result;
}

// Create a rotation matrix around the Z axis
static Matrix4 rotationZ(double angle) {
    double c = cos(angle);
    double s = sin(angle);
    Matrix4 result;
    result[0][0] = c;
    result[0][1] = -s;
    result[1][0] = s;
    result[1][1] = c;
    result[2][2] = result[3][3] = 1;
    return result;
}

// Create a perspective projection matrix
static Matrix4 perspective(double fov, double aspect, double near, double far) {
    double f = 1.0 / tan(fov * M_PI / 180.0 / 2.0);
    Matrix4 result;
    result[0][0] = f / aspect;
    result[1][1] = f;
    result[2][2] = (far + near) / (near - far);
    result[2][3] = 2.0 * far * near / (near - far);
    result[3][2] = -1.0;
    return result;
    }
    };

// Define a 3D wireframe model
struct Model3 {
vector<Point3> points;
vector<Line3> lines;
vector<Triangle3> triangles;

