import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtUser } from '../../common/interfaces/jwt-payload';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  private async unsetDefaultAddress(userId: string) {
    await this.prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  async create(createAddressDto: CreateAddressDto, currentUser: JwtUser) {
    const { isDefault, ...data } = createAddressDto;

    // Si se marca como default, desmarcar las demás direcciones del usuario
    if (isDefault) {
      await this.unsetDefaultAddress(currentUser.id);
    }

    return this.prisma.address.create({
      data: {
        ...data,
        userId: currentUser.id,
        isDefault: isDefault ?? false,
      },
    });
  }

  async findAll(currentUser: JwtUser) {
    return this.prisma.address.findMany({
      where: { userId: currentUser.id },
      orderBy: { isDefault: 'desc' },
    });
  }

  async findOne(id: string, currentUser: JwtUser) {
    const address = await this.prisma.address.findUnique({
      where: { id },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    if (address.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('You can only access your own addresses');
    }

    return address;
  }

  async update(
    id: string,
    updateAddressDto: UpdateAddressDto,
    currentUser: JwtUser,
  ) {
    // Verificar existencia y ownership
    await this.findOne(id, currentUser);

    const { isDefault, ...data } = updateAddressDto;

    // Si se marca como default, desmarcar las demás direcciones del usuario
    if (isDefault) {
      await this.unsetDefaultAddress(currentUser.id);
    }

    return this.prisma.address.update({
      where: { id },
      data: {
        ...data,
        isDefault: isDefault !== undefined ? isDefault : undefined,
      },
    });
  }

  async remove(id: string, currentUser: JwtUser) {
    await this.findOne(id, currentUser);

    const address = await this.prisma.address.delete({
      where: { id },
    });

    // Si se eliminó la dirección default, marcar otra como default si existe
    if (address.isDefault) {
      const nextAddress = await this.prisma.address.findFirst({
        where: { userId: currentUser.id },
        orderBy: { createdAt: 'asc' },
      });

      if (nextAddress) {
        await this.prisma.address.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return { message: 'Address deleted successfully' };
  }
}
