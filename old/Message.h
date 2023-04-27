#ifndef GAME_OBJECT_H
#define GAME_OBJECT_H

#include <string>

class GameObject {
public:
    GameObject(const std::string& name);
    void render();
    const std::string& getName() const;

private:
    std::string name_;
};

#endif // GAME_OBJECT_H
