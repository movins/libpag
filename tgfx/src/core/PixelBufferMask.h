/////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Tencent is pleased to support the open source community by making libpag available.
//
//  Copyright (C) 2021 THL A29 Limited, a Tencent company. All rights reserved.
//
//  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file
//  except in compliance with the License. You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
//  unless required by applicable law or agreed to in writing, software distributed under the
//  license is distributed on an "as is" basis, without warranties or conditions of any kind,
//  either express or implied. see the license for the specific language governing permissions
//  and limitations under the license.
//
/////////////////////////////////////////////////////////////////////////////////////////////////

#pragma once

#include "core/PixelBuffer.h"
#include "tgfx/core/Mask.h"

namespace tgfx {
class PixelBufferMask : public Mask {
 public:
  explicit PixelBufferMask(std::shared_ptr<PixelBuffer> buffer);

  void clear() override;

  std::shared_ptr<Texture> updateTexture(Context* context) override;

  std::shared_ptr<PixelBuffer> getBuffer() const {
    return buffer;
  }

 protected:
  void dirty(Rect rect, bool flipY = true);

  std::shared_ptr<PixelBuffer> buffer = nullptr;
  std::shared_ptr<Texture> texture;
  Rect dirtyRect = Rect::MakeEmpty();
};
}  // namespace tgfx
